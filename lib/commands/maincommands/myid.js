var usrUtils = require("../../utils/user.js");

var myidCommand = {
    usage: "",
    description: "Responds with the ID of the user who executed the command.",
    process: function (bot, msg, arguments) {
	var message = "**Username:** " + msg.author.name + "\n" + "**ID:** " + msg.author.id;
	if (usrUtils.hasRole(msg.channel.server, msg.author, "Authenticated")) {
		// Get msg.author UUID or MCName.
		message += "\n" + "**MC:** " + "PR3T-3ND-UU1D-TH15-L00K5-R34L-R1IGH1";
	}
	bot.sendMessage(msg.channel, message, function(err, channel) { if(err) console.log(err); });
    //Process the command here.
    // Bot = Discord.Client object
    // msg = Message object, msg.channel for bot.sendMessage(channel, message)
    // arguments = string of arguments for command (split(" ") for an array)
    }
};

module.exports = myidCommand;
