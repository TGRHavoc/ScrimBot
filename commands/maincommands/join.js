var User = require("../../utils/user");

var joinCommand = {
	usage: "[voice channel]",
	description: "Make the bot join a voice channel",
	permission: function(msg){
		return User.isAdmin(msg.channel.server, msg.author);
	},
	process: function(bot, msg, args){
		args = args.split(" ");

		if (args.length > 1){
			bot.sendMessage(msg, "You only need to specify the channels' name.");
			return;
		}else if(!args[0]){
			bot.sendMessage(msg, "Please specify a channel to join.");
			return;
		}

		for(var i = 0; i<msg.channel.server.channels.length; i++){
			var channel = msg.channel.server.channels[i];

			if (channel.type == "voice" && channel.name == args[0]){
				bot.joinVoiceChannel(channel, function(err, call) {
					if(!err)
						bot.sendMessage(msg, `I have joined the voice channel ${channel.name}`);
				});
			}else{
				bot.sendMessage(msg, `I cannot join '${args[0]}'. It is either a text channel or it doesn't exist.`);
				return;
			}
		}
	}
}


module.exports = joinCommand;
