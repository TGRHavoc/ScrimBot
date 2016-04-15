var PlayingCommand = {
	description: "Show the song the bot is currently playing - PLAY COMMAND NEEDS UPDATING",
	process: function(bot, data, args){
		if(typeof currentlyPlayingSong == "undefined" || !currentlyPlayingSong){
			bot.sendMessage({to: data.channel.id, message: "I'm not currently playing a song."});
			return;
		}
		var msg = "Now Playing:\n\t" + currentlyPlayingSong.prettyPrint();
		if (typeof nextSong != "undefined"){
			msg += "\n\nNext Up:\n\t" + nextSong.prettyPrint();
		}

		bot.sendMessage({to: data.channel.id, message: msg});
	}
};

module.exports = PlayingCommand;
