﻿var commands = { },
    config = require("./config"),
    cleaverbot =  require('./modules/cleverbot.js'),

    Discord = require("discord.js");

if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}


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
            bot.sendMessage(msg.channel, "**Available commands:**", function () {
                for (cmd in commands) {
                    var info = "!" + cmd;
                    var usage = commands[cmd].usage;
                    if (usage && usage != "")
                        info += " " + usage;

                    var description = commands[cmd].description;
                    if (description && description != "")
                        info += "\n\t" + description;
                    bot.sendMessage(msg.channel, info);
                }
            });
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
          if (msg.isMentioned(bot.user)){
            //Talk to them!
            cleaverbot.chat(bot, msg, arguments);
          }
        }
    }
});

bot.login(config.auth.email, config.auth.password);
