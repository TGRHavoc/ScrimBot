var commands = { },
    config = require("./config"),
    Discord = require("discord.io"),
	mcProto = require('minecraft-protocol'),
	fileUtils = require("./utils/fileUtils");

var bot = new Discord({
	autorun: true,
	token: config.auth.token
});

//Global variables
authServer = mcProto.createServer({
	"online-mode" : true,
	"motd": "ScrimBot's Authentication Server",
	"max-players" : 1,
    "port": config.auth_port || 25565
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
            commands[commandName] = require(filepath.replace("/lib/", "/"));
			commands[commandName].i = currentIndexOfCommand++; //Give each command an "index"
			if (commands[commandName].init && typeof commands[commandName].init == "function")
				commands[commandName].init();
        }
      }
    });
};

function sendHelpDm(bot, channelID, userID) {
	var title = "**Available commands** \n";
	var dm = title;
	for(cmd in commands){
		var info = '**'+cmd+'**';

		if(commands[cmd].permission && typeof commands[cmd].permission == "function")
			if (!commands[cmd].permission(bot, channelID, userID))
				continue; //They don't have permission for this command

		var usage = commands[cmd].usage;
		if(usage && usage != "")
			info += ' *'+usage+'*';

		var desc = commands[cmd].description;
		if(desc && desc != "")
			info += '\n\t'+desc;
		else
			info += "\n\tNo description for this command found.";
		dm += info +"\n";
	}
	bot.sendMessage({to: userID, message: dm});

	bot.sendMessage({to: channelID, message: bot.mention(userID) + ", I have sent my commands to you via DM"});
}

exitHandler = function(options, err) {
    if (err) console.log("Not clean" +err.stack);
    if (options.exit){
		console.log("Saving data to files...");

		if (!fileUtils.fileExists("lib/data/assosiations.json")){
			if (!fileUtils.dirExists("lib/data"))
				fileUtils.makeDir("lib/data");
			fileUtils.createFile("lib/data/assosiations.json");
		}

		if (!fileUtils.fileExists("lib/data/data.json")){
			if (!fileUtils.dirExists("lib/data"))
				fileUtils.makeDir("lib/data");
			fileUtils.createFile("lib/data/data.json");
		}

		fileUtils.writeFileSync("lib/data/assosiations.json", Assosiations, {options: {spaces: 4}});
		fileUtils.writeFileSync("lib/data/data.json", McData, {options: {spaces: 4}});
		console.log("Written all data to files... Now exiting.");

		process.exit();
	}
}
process.on('exit', exitHandler.bind(null,{clean:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

bot.mention = function( userID ){
	if (!userID)
		return "<@" + bot.id + ">";
	else
		return "<@" + userID + ">";
}

// Bot events
bot.on("ready", function () {
    loadCommands("./lib/commands/");

	console.log("Connected!");
	console.log("Logged in as: ");
	console.log(bot.username + " - (" + bot.id + ")");
	console.log("-------------------\n");

	if (fileUtils.fileExists("lib/data/assosiations.json")){
		fileUtils.readFile("lib/data/assosiations.json", function(err, data){
			if(err){
				console.log("Error reading: " + err.message);
				return;
			}

			Assosiations = data;
			console.log("Assosiations set");
		});
	}
	if (fileUtils.fileExists("lib/data/data.json")){
		fileUtils.readFile("lib/data/data.json", function(err, data){
			if(err){
				console.log("Error reading: " + err.message);
				return;
			}
			McData = data;
			console.log("McData set!");
		});
	}
	//Load out rest api server
	require("./utils/express")();

});

bot.on("disconnected", function () {
    console.log("I've been disconnected!!!");

	authServer.close();
	exitHandler({exit: true}, null);
});

bot.on("message", function (user, userID, channelID, message, rawEvent) {
	console.log(user + " - " + userID);
	console.log("in " + channelID);
	console.log(message);
	console.log("\n\n");

	if (userID != bot.id && (message[0] === '!' || message[0] === '/' || message.indexOf(bot.mention()) == 0)) { //If it's not the bot speaking, and message starts with ! or @ScrimBot
        console.log("Treating message from " + userID + " ("+user+") as command");

        var cmdText = message.split(" ")[0].substring(1); //Remove that pesky ! and /
        var arguments = message.substring(cmdText.length + 2); //Adding 2 for ! and the space

        if (message.indexOf(bot.mention()) == 0) {
            cmdText = message.split(" ")[1];
            arguments = message.substring(bot.mention().length + cmdText.length + 2);
        }

        cmdText = cmdText.toLowerCase();
        var cmd = commands[cmdText];
        if (cmdText === "help") {
			sendHelpDm(bot, channelID, userID);
            return;
        } else if(cmd) {
            if (cmdText in commands) {
                try {
					if(commands[cmdText].permission && typeof commands[cmdText].permission == "function"){
						if (!commands[cmdText].permission(bot, channelID, userID)){
							bot.sendMessage({to: channelID, message: bot.mention(userID) + ". Sorry, you don't have permission to run this command."});
							return; //They don't have permission for this command?
						}
					}

					var data = {
						channel: {
							id: channelID
						},
						user: {
							name: user,
							id: userID,
							mention: function(){
								return "<@" + userID + ">";
							}
						}
					};
					//Just run the command anyways
                    commands[cmdText].process(bot, data, arguments);
                } catch (e) {
                    //bot.sendMessage(msg, "Error occured when executing command '" + cmdText + "': " + e.stack);
                }
            }
        }else{
          //Not supplied a command
          if(userID == bot.id){
              return;
          }
          //bot.sendMessage(msg.channel, "Sorry, that command doesn't exist");
        }
    }

});


function sendMessages(ID, messageArr, interval) {
	var callback, resArr = [], len = messageArr.length;
	typeof(arguments[2]) === 'function' ? callback = arguments[2] : callback = arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;

	function _sendMessages() {
		setTimeout(function() {
			if (messageArr[0]) {
				bot.sendMessage({
					to: ID,
					message: messageArr.shift()
				}, function(err, res) {
					if (err) {
						resArr.push(err);
					} else {
						resArr.push(res);
					}
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendMessages();
			}
		}, interval);
	}
	_sendMessages();
}
