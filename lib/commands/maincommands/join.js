var User = require("../../utils/user");

var joinCommand = {
	usage: "[voice channel]",
	description: "Make the bot join a voice channel - NEEDS UPDATING",
	permission: function(bot, channelID, userID){
		return User.isAdmin(bot, channelID, userID);
	},
	process: function(bot, msg, args){
		return;
		args = args.split(" ");
		var found = false;
		if (args.length > 1){
			bot.sendMessage({to: msg.channel.id, message:"You only need to specify the channel's name."});
			return;
		}else if(!args[0]){
			bot.sendMessage({to: msg.channel.id, message:"Please specify a channel to join."});
			return;
		}

		for(var i = 0; i<msg.channel.server.channels.length; i++){
			var channel = msg.channel.server.channels[i];
			if (channel.name == args[0]){
				if (channel.type == "voice"){
					bot.joinVoiceChannel(channel, function(err, call) {
						if(!err){
							bot.sendMessage(msg, 'I have joined the voice channel '+args[0] + '.');
							found = true;
						}
					});
				}else{
					bot.sendMessage(msg, 'Sorry, the channel "'+ args[0]+'" isn\'t a voice channel.');
					found = true;//We found but, it's not voice
				}
			}
		}
	}
}


module.exports = joinCommand;
