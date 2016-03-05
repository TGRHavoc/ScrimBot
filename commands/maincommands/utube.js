var ytdl = require("ytdl-core");

formatTime = function(seconds) {
  return `${Math.round((seconds - Math.ceil(seconds % 60)) / 60)}:${String('00' + Math.ceil(seconds % 60)).slice(-2)}`;
};

Track = function(vid, info){
	this.vid = vid;
	this.title = info.title;
	this.author = info.author;
	this.viewCount = info.viewCount || info.view_count;
	this.lengthSeconds = info.lengthSeconds || info.length_seconds;
}

Track.prototype.formatViewCount = function() {
  return this.viewCount ? this.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'unknown';
};

Track.prototype.formatTime = function() {
  return formatTime(this.lengthSeconds);
};

Track.prototype.prettyPrint = function() {
  return `**${this.title}** by **${this.author}** *(${this.formatViewCount()} views)* [${this.formatTime()}]`;
};

Track.prototype.fullPrint = function() {
  return `${this.prettyPrint()}, added by <@${this.userId}>`;
};

Track.prototype.saveable = function() {
  return {
    vid: this.vid,
    title: this.title,
    author: this.author,
    viewCount: this.viewCount,
    lengthSeconds: this.lengthSeconds,
  };
};

Track.prototype.getTime = function() {
  return this.lengthSeconds;
};

YoutubeTrack = function(){
	Track.apply(this, arguments);
};

YoutubeTrack.prototype = Object.create(Track.prototype);

YoutubeTrack.getInfoFromVid = function(vid, m, cb) {
  var requestUrl = 'http://www.youtube.com/watch?v=' + vid;
  ytdl.getInfo(requestUrl, (err, info) => {
    if (err) cb(err, undefined);
    else {
      var video = new YoutubeTrack(vid, info);
      video.userId = m.author.id;
      video.containedVideo = info;
      cb(undefined, video);
    }
  });
};

YoutubeTrack.prototype.getStream = function() {
  var options = {
    filter: (format) => format.container === 'mp4',
    quality: 'lowest',
  };
  return ytdl.downloadFromInfo(this.containedVideo, options);
};

var utubeCommand = {
	process: function(bot, msg, arguments){
		if(!bot.voiceConnection){
			var channels = bot.channels;
			for(var i = 0;  i<channels.length; i++){
				var channel = channels[i];
				if (channel.type == "voice" && channel.name == "Music"){
					bot.joinVoiceChannel(channel);
					return;
				}
			}
		}
		var connection = bot.voiceConnection;

		YoutubeTrack.getInfoFromVid(arguments, msg, (err, video) => {
			if(err)
				console.log(err);
			else{
				var currentStream = video.getStream();
				currentStream.on('error', (err) => {
					if (err.code === 'ECONNRESET') {
						bot.sendMessage(msg, `There was a network error during playback! The connection to YouTube may be unstable. Auto-skipping to the next video...`);
					} else {
						bot.sendMessage(msg, `There was an error during playback! **${err}**`);
					}
					console.log("Stopped?");
				 });
				 currentStream.on('end', () => setTimeout(function(){
				 		if (bot.voiceConnection)
					  		bot.voiceConnection.stopPlaying();

						bot.sendMessage(msg, `Finished playing **${video.title}**`);
	  					bot.setStatus('online', null);
				 }, 8000)); // 8 second leeway for bad timing

				 connection.playRawStream(currentStream, function(err, intent){
				 	if(err)
						console.log("Error: " + err);
					intent.on("end", function(){
						console.log("Playback ended");
					});
					intent.on("error", function(){
						console.log("Error: " + err);
					});
				 });
			}
		});
	}
};

module.exports = utubeCommand;
