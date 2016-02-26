var myidCommand = {
    usage: "",
    description: "Responds with the ID of the user who executed the command.",
    process: function (bot, msg, arguments) {
	bot.sendMessage(msg.channel, "**Username:** " + msg.author.name + "\n" + "**ID:** " + msg.author.id, function(err, channel) { if(err) console.log(err); });
    //Process the command here.
    // Bot = Discord.Client object
    // msg = Message object, msg.channel for bot.sendMessage(channel, message)
    // arguments = string of arguments for command (split(" ") for an array)
    }
};

module.exports = myidCommand;
