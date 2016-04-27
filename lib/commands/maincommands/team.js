var config = require("../../config");

var teamArguments = {
	"help" : {
		description: "Show the help commands with usage, description etc",
		process: function(bot, msg){
			var message = 'Available commands ('+Object.size(teamArguments)+')\n';

			for(cmd in teamArguments){

				var info = "**team "+cmd+"**";
				if (teamArguments[cmd].permission && typeof teamArguments[cmd].permission == "function"){
					if (!teamArguments[cmd].permission(bot, msg.channel.id, msg.user.id)){
						continue;
					}
				}

				var usage = teamArguments[cmd].usage;
				if(usage)
					for(i in usage)
						info += ' [*'+usage[i]+']*';

				var desc = teamArguments[cmd].description;
				if(desc && desc != "")
					info += '\n\t'+desc;
				else
					info += "\n\tNo description for this command found.";
				message += info +"\n";
			}

			bot.sendMessage({to: msg.user.id, message: message});
			//bot.sendMessage(msg, "I have sent my commands to you via DM");
		}
	},
	"create" : {
		usage: ["team name"], //Arguments for this command
		description: "Create a team with the specified name (no spaces)", //Quick description of the command
		process: function(bot, msg, args){ //Args is an array with our arguments.
			//E.g. args[0] = team name
			var teamName = args[0];
			if (config.team.banned_teams.indexOf(teamName.toLowerCase()) != -1 || config.team.banned_teams.indexOf(teamName.toLowerCase().slice(0,-1)) != -1){ //If it's in our banned names array
				bot.sendMessage({to: msg, message: "That team name isn't allowed"});
				return;
			}
			//Good to go!
		}
	}
}
var teamCommand = {
  	usage: "",
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
			if (!command.permission(bot, msg.channel.id, msg.user.id)){
				return;
			}
		}

		var commandArgs = args.slice(1);// Remove the command from the arguments
		if (command.usage && commandArgs.length != command.usage.length){
			var commandUsage = '**team '+args[0]+'**';
			for(arg in command.usage)
				commandUsage += ' *['+command.usage[arg]+']*';
			var desc = command.description;
			if (desc && desc != "") //***${desc}***.
				commandUsage += '\n\t'+desc+'';
			else
				commandUsage += "\n\tNo description for this command found.";
			bot.sendMessage({to: msg.channel.id, message: commandUsage});
			return;
		}

		command.process(bot, msg, commandArgs);
	}
};

module.exports = teamCommand;
