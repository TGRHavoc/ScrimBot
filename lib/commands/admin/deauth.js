var role = require("../../utils/roles.js");

var deauthCommand = {
	usage: "<mentioned user(s)>",
	description: "Deauthenticate the mentioned user",
	permission: function(bot, channelID, userID){
		return user.isAdmin(bot, channelID, userID);
	},
	process: function(bot, msg, args){
		//console.log("deauthenticating");

		for(var i = 0; i< msg.mentions.length; i++){
			var user = msg.mentions[i];
			console.log("User: " + JSON.stringify(user));
			MongoUser.findOne({discordId: user.id}, function(err, u){
				if (err){
					console.log("Error: " + err);
					return;
				}

				if(u){
					u.remove(function(err){
						if (err){
							console.log("Error deleting user: " + err);
							return;
						}
						console.log("Successfully deleted user");
					});

					//Remove their role
					bot.removeFromRole({
					    server: bot.serverFromChannel(msg.channel.id),
					    user: user.id,
					    role: role.getRoleId(bot, msg.channel.id, "Authenticated")
					}, function(err, resp){
						if(!err){
							bot.sendMessage({to: msg.channel.id, message:"Successfully deauthenticated " + user.username});
						}
					});
				}else{
					bot.sendMessage({to: msg.channel.id, message: "Sorry, " + user.username +" hasn't authenticated"});
				}
			});
		}

	}
};

module.exports = deauthCommand;
