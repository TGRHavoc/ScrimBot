var usrUtils = require("../../utils/user.js"),
	search = require("../../utils/algo/binarySearch");

var myidCommand = {
    usage: "",
    description: "Responds with the ID of the user who executed the command.",
    process: function (bot, msg, arguments) {

		var message = "**Username:** " + msg.user.name + "\n" + "**Discord ID:** " + msg.user.id;

		MongoUser.findOne({discordId: msg.user.id}, function(err, user){
			if(err){
				return;
			}
			if (user){
				message += "\n**Mc Username:** " + user.minecraftName;
				message += "\n**Mc UUID:** " + user.uuid;
			}

			bot.sendMessage({to: msg.channel.id, message: message});
		});
	}
};

module.exports = myidCommand;
