var userUtil = require("../../utils/user");

var whoisCommand = {
	usage: "<mentioned user>",
	description: "Gets information on the mentioned user.",
	process: function(bot, msg, arguments){
		if (msg.mentions.length == 0){
			// No user specified
			bot.sendMessage({to: msg.channel.id, message: "Sorry, you must specify a user."});
			return;
		}else if(msg.mentions.length > 1){
			// Too many mentioned users
			bot.sendMessage({to: msg.channel.id, message: "Sorry, you can only run the command on one user at a time."});
			return;
		}

		MongoUser.findOne({discordId: msg.mentions[0].id }, function(err, data){
			if (err){
				console.log("Error getting user info: "+ JSON.stringify(err));
				return;
			}

			if (data){
				var message = "Details for *" + msg.mentions[0].username + "*:";
				message += "\n\n**Minecraft Name**: " + data.minecraftName;
				if (data.teamName)
					message += "\n**Team**: " + data.teamNames;

				message += "\n**Kills**: " + data.kills;
				message += "\n**Deaths**: " + data.deaths;
				message += "\n**Scrims Won**: " + data.wins;
				message += "\n**Scrims Lost**: " + data.loses;
				message += "\n**Scrims Played**: " + data.totalPlayed;
				bot.sendMessage({to: msg.channel.id, message: message});
			}else{
				bot.sendMessage({to: msg.channel.id, message: "Sorry, I couldn't find any information on them."});
			}
		});

	}
};


module.exports = whoisCommand;
