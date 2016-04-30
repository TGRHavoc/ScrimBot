var config = require("../../config"),
	userUtil = require("../../utils/user");

/*
function hasAtleast(bot, userId, permissionLevel){
	// PermissionLevel is the lowest level the user needs to execute the command.
	// E.g. Owner 		= Only the owner of the team
	// 		Promoted 	= Promoted users + Owner
	//		Member 		= All members
}
*/

var teamArguments = {
	"help" : {
		description: "Show the help commands with usage, description etc",

		process: function(bot, msg){
			var _msg = 'Available commands\n';

			for(cmd in teamArguments){
				console.log("cmd: " + cmd);

				var info = "**team "+cmd+"**";
				if (teamArguments[cmd].permission && typeof teamArguments[cmd].permission == "function"){
					if (!teamArguments[cmd].permission(bot, msg.channel.id, msg.user.id)){
						continue;
					}
				}

				var usage = teamArguments[cmd].usage;
				if(usage)
					info += ' *'+usage[i]+'*';

				var desc = teamArguments[cmd].description;
				if(desc && desc != "")
					info += '\n\t'+desc;
				else
					info += "\n\tNo description for this command found.";
				_msg += info +"\n";
			}

			bot.sendMessage({to: msg.user.id, message: _msg});
			//bot.sendMessage(msg, "I have sent my commands to you via DM");
		} //End process for help

	}, // end of help command

	"create" : {
		usage: "<team name>", //Arguments for this command
		description: "Create a team with the specified name (no spaces)", //Quick description of the command

		process: function(bot, msg, args){ //Args is an array with our arguments.
			//E.g. args[0] = team name
			if (args.length != 1){
				if (args.length == 0){
					// Not enough
					bot.sendMessage({to: msg.channel.id, message:"Please specify a team name"});
				}else{
					// Too many
					bot.sendMessage({to: msg.channel.id, message:"Too many arguments. Do `!team help` to see how to use this command."});
				}
				return;
			}
			var teamName = args[0];
			console.log("Team to create: " + teamName);

			if (config.team.banned_teams.indexOf(teamName.toLowerCase()) != -1 || config.team.banned_teams.indexOf(teamName.toLowerCase().slice(0,-1)) != -1){ //If it's in our banned names array
				bot.sendMessage({to: msg, message: "That team name isn't allowed"});
				return;
			}

			MongoUser.findOne({discordId: msg.user.id}, function(err, user){
				if (err){
					console.log("Error finding user: " + userId + "\n" + err);
					return false;
				}
				console.log("User found: " + user.minecraftName);
				if (user){
					if (user.teamName == "748r3yu"){
						bot.sendMessage({to: msg.channel.id, message: "You're already in the team \"" + user.teamName + "\""});
					}else{
						MongoTeam.findOne({name: teamName}, function(err, team){
							if(err){
								console.log("Error finding team: " + teamName + "\n" + err);
								return;
							}
							if (team){
								bot.sendMessage({to: msg.channel.id, message: "Sorry, a team with the name \"" + teamName + "\" already exists."});
							}else{
								var teamData = new MongoTeam({
									name: teamName,
									owner: msg.user.id
								});

								teamData.members.push(msg.user.id);
								teamData.save();

								user.teamName = teamName;
								user.save();

								bot.sendMessage({to: msg.channel.id, message: msg.user.mention() + ", you have successfully created and joined the team \"" + teamName + "\""});
							}
						});
					}
				}else{
					bot.sendMessage({to: msg.channel.id, message: "You must be authenticated before you can create a team"});
				}
			});

		} //end process for create
	}, // end of create command

	"info" : {
		usage: "<team name>",
		description: "Gets info about a team",

		process: function(bot, msg, args){
			//TODO: Implement
		}

	}, // End of info command
	"delete" : {
		usage: "<team name>",
		permission: function(bot, channelID, userID){
			return userUtil.isAdmin(bot, channelID, userID);
	    },

		process: function(bot, msg, args){
			console.log("Team: " + JSON.stringify(args));

			if (args.length != 1){
				if (args.length == 0){
					// Not enough
					bot.sendMessage({to: msg.channel.id, message:"Please specify a team name"});
				}else{
					// Too many
					bot.sendMessage({to: msg.channel.id, message:"Please only give one team name at a time"});
				}
				return;
			}

			MongoTeam.findOne({name: args[0]}, function(err, team){
				if (err){
					console.log("error: " + err);
					return;
				}

				if (team){
					console.log("Members: " + JSON.stringify(team) + "\n" + JSON.stringify(team.members));
					for (var i = 0; i < team.members.length; i++){
						var userId = team.members[i];
						console.log("Updating user: " + userId);
						MongoUser.findOne({discordId: userId}, function(err, user){
							user.teamName = null;
							user.save();
							console.log("Removed teamName from " + user.minecraftName);
						});
					}

					setTimeout(function(){
						MongoTeam.remove({name: args[0]}, function(err){
							if (err){
								console.log("ERROR deleting team: " + err);
								return;
							}

							bot.sendMessage({to: msg.channel.id, message: "Deleted team \"" + args[0] + "\""});
						});
					}, 2000); // Wait 2 seconds (allow all members to be removed from team)
				}
			});
		}
	}, // end of delete command
	"list": {
		permission: function(bot, channelID, userID){
			return userUtil.isAdmin(bot, channelID, userID);
	    },
		process: function(bot, msg, args){
			MongoTeam.find({}, function(err, teams){
				if(err){
					console.log("There was an error getting teams: " + err);
					return;
				}
				var message = "Teams:\n";
				if (teams.length == 0){
					message += "\tNo teams to display.";
				}
				for(var i = 0; i < teams.length; i++){
					message += "\t" + teams[i].name + " - " + teams[i].members.length + " member(s)\n";
				}
				bot.sendMessage({to: msg.user.id, message: message});
			});
		}
	} // end of list command
};


var teamCommand = {
  	usage: "<command> [args]",
  	description: "A shot at teams.. and roles. - NEEDS UPDATING",
	process: function (bot, msg, arguments) {
		var args = arguments.split(" ");

		if (!(args[0] in teamArguments)){
			bot.sendMessage({to: msg.channel.id, message: "That team command doesn't exist.\nI've sent you the commands available."});
			//TODO: Print out available commands?
			teamArguments["help"].process(bot, msg);
			return;
		}

		var command = teamArguments[args[0]];
		if (command.permission && typeof command.permission == "function"){
			if (!command.permission(bot, msg.channel.id, msg.user.id)){ // They don't have perm
				return;
			}
		}

		var commandArgs = args.slice(1);

		console.log("Processing: " + JSON.stringify(command));
		command.process(bot, msg, commandArgs);
	}
};

module.exports = teamCommand;
