var commands = { },
    config = require("./config"),
    Discord = require("discord.js");

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
        }
      }
    });
};

var bot = new Discord.Client();

bot.on("ready", function () {
    loadCommands("./commands/");
    console.log("\nReady to serve! Currently " + bot.channels.length + " channels!");
});

bot.on("disconnected", function () {
    console.log("I've been disconnected!!!");
    process.exit(1);//Exit with error
});


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
					info += ` *${usage}* >> `;
				else
					info += " >> ";

				var description = commands[cmd].description;
				if (description && description != "")
					info += `***${description}***`;

				bot.sendMessage(msg.channel, info);
			}

		}
	});
}

function sendHelpDm(bot, msg){
	var title = `Available commands (${Object.size(commands)})`;
	bot.sendMessage(msg.author, title, function(){
		var dm = "";
		for(cmd in commands){
			var info = `**${cmd}**`;

			var usage = commands[cmd].usage;
			if(usage && usage != "")
				info += ` *${usage}* >> `;
			else
				info += " >> "
			var desc = commands[cmd].description;
			if(desc && desc != "")
				info += `\n\t***${desc}***.`;

			dm += info +"\n";
		}
		bot.sendMessage(msg.author, dm);

		bot.sendMessage(msg, "I have sent my commands to you via DM");
	});
}

bot.on("message", function (msg) {
    if (msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content[0] === '/' || msg.content.indexOf(bot.user.mention()) == 0)) { //If it's not the bot speaking, and message starts with ! or @ScrimBot
        console.log("Treating message from " + msg.author + " as command");

        var cmdText = msg.content.split(" ")[0].substring(1); //Remove that pesky !
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
                    commands[cmdText].process(bot, msg, arguments);
                } catch (e) {
                    bot.sendMessage(msg.channel, "Error occured when executing command '" + cmdText + "': " + e.stack);
                }
            } else {
                bot.sendMessage(msg.channel, "Sorry, that command don't exist");
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
