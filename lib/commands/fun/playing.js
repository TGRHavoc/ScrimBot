var PlayingCommand = {
	description: "Show the song the bot is currently playing - PLAY COMMAND NEEDS UPDATING",
	process: function(bot, data, args){
		if(typeof currentlyPlayingSong == "undefined" || !currentlyPlayingSong){
			bot.sendMessage({to: data.channel.id, message: "I'm not currently playing a song."});
			return;
		}

		bot.sendMessage({to: data.channel.id, message: 'Now Playing:\n'+currentlyPlayingSong.prettyPrint()});
	}
};

module.exports = PlayingCommand;
