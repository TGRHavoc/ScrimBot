var commands = { },
    config = require("./config"),
    Discord = require("discord.js"),
	mcProto = require('minecraft-protocol'),
	fileUtils = require("./utils/fileUtils");

authServer = mcProto.createServer({
	"online-mode" : true,
	"motd": "ScrimBots' Authentication Server",
	"max-players" : 1
});

Assosiations = []; //DiscordID -> UUID
McData = []; // UUID -> Rest of data

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var currentIndexOfCommand = 0;
function loadCommands(dir){
    var fs = require("fs");
    fs.readdirSync(dir).forEach(function (filename) {
      var filepath = dir + filename;
      if ( fs.statSync(filepath).isDirectory() ){
        loadCommands(filepath + "/");
      }else{
        if (filename.split(".").pop() == "js") {
            var commandName = filename.split(".")[filename.split(".").length - 2];

            if (commandName in commands) {
                console.log("Error, command '" + commandName + "' already exists");
                return;
            }
            commands[commandName] = require(filepath);
			commands[commandName].i = currentIndexOfCommand++; //Give each command an "index"
			if (commands[commandName].init && typeof commands[commandName].init == "function")
				commands[commandName].init();
        }
      }
    });
};

var bot = new Discord.Client();

bot.on("ready", function () {
    loadCommands("./commands/");
    console.log("\nReady to serve! Currently " + bot.channels.length + " channels!");

	//TODO: Asynchrony load our files with discordId -> UUID and UUID -> Data
	if (fileUtils.fileExists("data/assosiations.json")){
		fileUtils.readFile("data/assosiations.json", function(err, data){
			if(err){
				console.log("Error reading: " + err.message);
				return;
			}

			Assosiations = data;
		});
	}
	if (fileUtils.fileExists("data/data.json")){
		fileUtils.readFile("data/data.json", function(err, data){
			if(err){
				console.log("Error reading: " + err.message);
				return;
			}
			McData = data;
		});
	}
});

bot.on("disconnected", function () {
    console.log("I've been disconnected!!!");

	authServer.close();
	exitHandler({exit: true}, null);
});

function exitHandler(options, err) {
    if (err) console.log("Not clean" +err.stack);
    if (options.exit){
		console.log("Saving data to files...");

		if (!fileUtils.fileExists("data/assosiations.json")){
			if (!fileUtils.dirExists("data"))
				fileUtils.makeDir("data");
			fileUtils.createFile("data/assosiations.json");
		}

		if (!fileUtils.fileExists("data/data.json")){
			if (!fileUtils.dirExists("data"))
				fileUtils.makeDir("data");
			fileUtils.createFile("data/data.json");
		}

		fileUtils.writeFileSync("data/assosiations.json", Assosiations, {options: {spaces: 4}});
		fileUtils.writeFileSync("data/data.json", McData, {options: {spaces: 4}});
		console.log("Written all data to files... Now exiting.");

		process.exit();
	}
}

process.on('exit', exitHandler.bind(null,{clean:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function sendPagedHelp(bot, msg, arguments){
	var args = arguments.split(" ");
	var pageToShow = 1;
	if (args[0]){ //They have supplied a page no.
		if (isNaN(args[0])){
			//Not given a number
			bot.sendMessage(msg.channel, "Sorry, '" + args[0] + "' isn't a number!");
			return;
		}else{
			pageToShow = parseInt(args[0]);
		}
	}

	var maxPagesNo = Math.floor( ( (Object.size(commands) - 1) / config.help.messages_per_page) +1 );
		start = (pageToShow - 1) * config.help.messages_per_page,
		end = start + config.help.messages_per_page;

	if (!(pageToShow > 0 && pageToShow <= maxPagesNo)){
		bot.sendMessage(msg.channel, "Sorry that page doesn't exist!");
		return;
	}

	var title = `**Available commands ( page _${pageToShow}_ of _${maxPagesNo}_ ):**`;
	bot.sendMessage(msg.channel, title, function () {
		for (cmd in commands) {
			if (commands[cmd].i >= start && commands[cmd].i < end){
				var info = `**${cmd}**`;

				var usage = commands[cmd].usage;
				if (usage && usage != "")
					info += ` *${usage}*`;

				var description = commands[cmd].description;
				if (description && description != "")
					info += `\n\t${description}`;
				else
					info += "\n\tNo description for this command found.";
				bot.sendMessage(msg.channel, info);
			}

		}
	});
}

function sendHelpDm(bot, msg){
	var title = `Available commands`;
	bot.sendMessage(msg.author, title, function(){
		var dm = "";
		for(cmd in commands){
			var info = `**${cmd}**`;

			if(commands[cmd].permission && typeof commands[cmd].permission == "function")
				if (!commands[cmd].permission(msg))
					continue; //They don't have permission for this command
			var usage = commands[cmd].usage;
			if(usage && usage != "")
				info += ` *${usage}*`;

			var desc = commands[cmd].description;
			if(desc && desc != "")
				info += `\n\t${desc}.`;
			else
				info += "\n\tNo description for this command found.";
			dm += info +"\n";
		}
		bot.sendMessage(msg.author, dm);

		bot.sendMessage(msg, "I have sent my commands to you via DM");
	});
}

bot.on("message", function (msg) {
    if (msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content[0] === '/' || msg.content.indexOf(bot.user.mention()) == 0)) { //If it's not the bot speaking, and message starts with ! or @ScrimBot
        console.log("Treating message from " + msg.author + "("+msg.author.name+") as command");

        var cmdText = msg.content.split(" ")[0].substring(1); //Remove that pesky ! and /
        var arguments = msg.content.substring(cmdText.length + 2); //Adding 2 for ! and the space

        if (msg.content.indexOf(bot.user.mention()) == 0) {
            try {
                cmdText = msg.content.split(" ")[1];
                arguments = msg.content.substring(bot.user.mention().length + cmdText.length + 2);
            } catch (e) { //no command
                bot.sendMessage(msg.channel, "Yes?");
                return;
            }
        }
        cmdText = cmdText.toLowerCase();
        var cmd = commands[cmdText];
        if (cmdText === "help") {
			if(!config.help.send_dm){
				sendPagedHelp(bot, msg, arguments);
			}else{
				sendHelpDm(bot, msg);
			}
            return;
        } else if(cmd) {
            if (cmdText in commands) {
                try {
					if(commands[cmdText].permission && typeof commands[cmdText].permission == "function"){
						if (!commands[cmdText].permission(msg)){
							bot.sendMessage(msg, "Sorry, you don't have permission to run this command.");
							return; //They don't have permission for this command?
						}
					}

					//Just run the command anyways
                    commands[cmdText].process(bot, msg, arguments);
                } catch (e) {
                    bot.sendMessage(msg, "Error occured when executing command '" + cmdText + "': " + e.stack);
                }
            }
        }else{
          //Not supplied a command
          if(msg.author == bot.user){
              return;
          }
          bot.sendMessage(msg.channel, "Sorry, that command doesn't exist");
        }
    }
});

bot.login(config.auth.email, config.auth.password);
