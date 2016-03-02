var ytdl = require("ytdl-core");

var playCommand = {
	usage: "[youtube video id]",
	description: "Play a YouTube video's audio",
	process: function(bot, msg, args){
		if (!bot.voiceConnection){
			for(var i = 0; i<msg.channel.server.channels.length; i++){
				var channel = msg.channel.server.channels[i];

				if (channel.type == "voice" && channel.name == "Music"){
					bot.joinVoiceChannel(channel, function(err, call) {
						if(!err)
							playUrl(bot, args);
					});
				}
			}
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
