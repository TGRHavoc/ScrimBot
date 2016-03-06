var PlayingCommand = {
	description: "Show the song the bot is currently playing",
	process: function(bot, msg, args){
		if(typeof currentlyPlayingSong == "undefined" || !currentlyPlayingSong){
			bot.sendMessage(msg, "I'm not currently playing a song.");
			return;
		}

		bot.sendMessage(msg, 'Now Playing:\n'+currentlyPlayingSong.prettyPrint());
	}
};

module.exports = PlayingCommand;
