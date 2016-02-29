var config = require("../../config");

var teamArguments = {
	"create" : {
		usage: ["team name"], //Arguments for this command
		description: "Create a team with the specified name (no spaces)", //Quick description of the command
		process: function(bot, msg, args){ //Args is an array with our arguments.
			//E.g. args[0] = team name
			var teamName = args[0];
			if (config.team.banned_teams.indexOf(teamName) != -1){ //If it's in our banned names array
				bot.sendMessage(msg, "That team name isn't allowed");
				return;
			}
			//Good to go!
		}
	}
}
var teamCommand = {
  	usage: "",
  	description: "A shot at teams.. and roles.",
	process: function (bot, msg, arguments) {
		var args = arguments.split(" ");
		if (!(args[0] in teamArguments)){
			bot.sendMessage(msg, "That team command doesn't exist");
			//TODO: Print out available commands?
			return;
		}

		var command = teamArguments[args[0]];
		var commandArgs = args.slice(1);// Remove the command from the arguments
		if (commandArgs.length != command.usage.length){
			var commandUsage = `**team ${args[0]}**`;
			for(arg in command.usage)
				commandUsage += ` *[${command.usage[arg]}]*`
			var desc = command.description;
			if (desc && desc != "") //***${desc}***.
				commandUsage += ` >> ***${desc}***`;

			bot.sendMessage(msg, commandUsage);
			return;
		}

		command.process(bot, msg, commandArgs);
	}
};

module.exports = teamCommand;
