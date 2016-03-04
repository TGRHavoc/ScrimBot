var ytdl = require("ytdl-core");

var playCommand = {
	usage: "[youtube video id]",
	description: "Play a YouTube video's audio",
	permission: function(msg){
		var user = msg.author;
		var server = msg.channel.server;
		return true;
	},
	process: function(bot, msg, args){
		args = args.split(" ");
		//TODO: Check they can do this command?
		if (args.length > 1 && !args[0]){
			bot.sendMessage(msg, "Please specify a YouTube video ID. E.g. PivWY9wn5ps");
			return;
		}

		if (!bot.voiceConnection){
			bot.sendMessage(msg, `I'm not in a voice channel. Please use the join command first!`);
			return;
		}

		playUrl(bot, args);

	}
};

function playUrl(bot, args){
	var url = `http://www.youtube.com/watch?v=${args}`;
	console.log("Playing: " + url);
	//TODO: Get vid info and show etc..

	if(bot.voiceConnection){
		bot.voiceConnection.stopPlaying();
		bot.voiceConnection.playRawStream(ytdl(url, {filter: 'audioonly'}));
	}
}

module.exports = playCommand;
