var commands = require("./commands"),
    config = require("./config"),
    Discord = require("discord.js");

//Get command: commands[base]


var bot = new Discord.Client();


bot.on("ready", function () {
    console.log("\nReady to serve! Currently " + bot.channels.length + " channels!");
});

bot.on("disconnected", function () {
    console.log("I've been disconnected!!!");
    process.exit(1);//Exit with error
});

bot.on("message", function (msg) {
    if (msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)) { //If it's not the bot speaking, and message starts with ! or @ScrimBot
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
        }

    }
});

bot.login(config.auth.email, config.auth.password);