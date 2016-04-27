var usrUtils = require("../../utils/user.js"),
	search = require("../../utils/algo/binarySearch");

var myidCommand = {
    usage: "",
    description: "Responds with the ID of the user who executed the command. - NEEDS UPDATING",
    process: function (bot, msg, arguments) {
		return;
		var message = "**Username:** " + msg.user.name + "\n" + "**Discord ID:** " + msg.user.id;
		if (usrUtils.hasRole(bot, msg.channel.id, msg.user.id, "Authenticated")) {
			// Get msg.author UUID or MCName.
			//message += "\n" + "**MC:** " + "PR3T-3ND-UU1D-TH15-L00K5-R34L-R1IGH1";
			var data = search.search(Assosiations, "discordId", msg.user.id);

			message += "\n**Mc UUID:** " + data.uuid;
		}

		bot.sendMessage({to: msg.channel.id, message: message});
	}
};

module.exports = myidCommand;
