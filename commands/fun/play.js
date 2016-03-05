var ytdl = require("ytdl-core");

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
		if (!args[0]){
			bot.sendMessage(msg, "Please specify a YouTube video ID. E.g. PivWY9wn5ps");
			return;
		}

		if (!bot.voiceConnection){
			bot.sendMessage(msg, `I'm not in a voice channel. Please use the join command first!`);
			return;
		}

		YoutubeTrack.getInfoFromVid(args[0], msg, function(err, video){
			if(err){
				console.log("Play error: " + err);
				bot.sendMessage(msg, `Error playing video: ${err}`);
				return;
			}

			currentlyPlayingSong = video;
			var stream = video.getStream();

			stream.on('end', () => setTimeout(function(){
				   if (bot.voiceConnection)
					   bot.voiceConnection.stopPlaying();

				   bot.sendMessage(msg, `Finished playing **${video.title}**`);
				   bot.setStatus('online', null);
				   currentlyPlayingSong = null;
			}, 4000)); // 4 second leeway for bad timing

			bot.voiceConnection.playRawStream(stream, function(err, intent){

				bot.sendMessage(msg, `${video.prettyPrint()}`);
				bot.setStatus("online", video.author);
			});
		});

	}
};

module.exports = playCommand;
