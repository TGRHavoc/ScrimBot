var usrUtils = require("../../utils/user.js");

var myidCommand = {
    usage: "",
    description: "Responds with the ID of the user who executed the command.",
    process: function (bot, msg, arguments) {
		var message = "**Username:** " + msg.user.name + "\n" + "**ID:** " + msg.user.id;
		if (usrUtils.hasRole(bot, msg.channel.id, msg.user.id, "Authenticated")) {
			// Get msg.author UUID or MCName.
			message += "\n" + "**MC:** " + "PR3T-3ND-UU1D-TH15-L00K5-R34L-R1IGH1";
		}
		bot.sendMessage({to: msg.channel.id, message: message});
	}
};

module.exports = myidCommand;
