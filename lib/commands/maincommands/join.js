var User = require("../../utils/user"),
	channels = require("../../utils/channels");

var joinCommand = {
	usage: "<voice channel>",
	description: "Make the bot join a voice channel",
	permission: function(bot, channelID, userID){
		return User.isAdmin(bot, channelID, userID);
	},
	process: function(bot, msg, args){
		//return;
		args = args.split(" ");
		var found = false;
		if (args.length > 1){
			bot.sendMessage({to: msg.channel.id, message:"You only need to specify the channel's name."});
			return;
		}else if(!args[0]){
			var member = bot.servers[bot.serverFromChannel(msg.channel.id)].members[msg.user.id];
			if (member.voice_channel_id){
				bot.joinVoiceChannel(member.voice_channel_id);
				return;
			}

			bot.sendMessage({to: msg.channel.id, message:"Please specify a channel to join."});
			return;
		}

		var channel = channels.GetChannel(bot, msg, args[0]);

		if (channel){
			if (channel.type != "voice"){
				bot.sendMessage({to: msg.channel.id, message: "Sorry, that isn't a voice channel"});
				return;
			}

			bot.joinVoiceChannel(channel.id);
		}else{
			bot.sendMessage({to: msg.channel.id, message:"Sorry, that channel doesn't exist"});
		}
	}
};


module.exports = joinCommand;
