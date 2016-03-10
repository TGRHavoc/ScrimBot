var user = require("../../utils/user.js"),
	search = require("../../utils/algo/binarySearch.js"),
	sort = require("../../utils/algo/mergeSort.js"),
	role = require("../../utils/roles.js");

var deauthCommand = {
	usage: "[mentioned user(s)]",
	description: "Deauthenticate the mentioned user",
	permission: function(msg){
		return user.isAdmin(msg.channel.server, msg.author);
	},
	process: function(bot, msg, args){
		if (msg.everyOneMentioned){
			bot.sendMessage(msg, "Sorry, cannot mention everyone");
			return;
		}

		for(var i = 0; i< msg.mentions.length; i++){
			var user = msg.mentions[i];
			var assosition = search.search(Assosiations, "discordId", user.id);
			if (assosition == -1){
				console.log("Sorry, cannot find \"" + user.name + "\" in the assosition array (they haven't authenticated)");
				continue; //Continue onto next entry
			}

			var data = search.search(McData, "uuid", assosition.uuid);
			if (data == -1){
				console.log("Sorry, cannot find \"" + assosition.uuid + "\" in the data array (they haven't authenticated??)");
				continue; //
			}

			//Delete them from the arrays
			search.delete(McData, "uuid", assosition.uuid);
			search.delete(Assosiations, "discordId", user.id);

			//Re-sort the arrays
			McData = sort(McData, "discordId");
			Assosiations = sort(Assosiations, "uuid");

			//Remove their role
			bot.removeUserFromRole(user, role.getRoleFromName("Authenticated"), function(err){
				if (err)
					bot.sendMessage(msg, "There was an error deauthenticating " + user.name + ":\n"+ err);
			});
		}

	}
};

module.exports = deauthCommand;
