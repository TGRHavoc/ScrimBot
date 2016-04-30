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
  return Math.round((this.lengthSeconds - Math.ceil(this.lengthSeconds % 60)) / 60) + ":" + String('00' + Math.ceil(this.lengthSeconds % 60)).slice(-2);
  //return formatTime(this.lengthSeconds);
};

Track.prototype.prettyPrint = function() {
  return '**'+this.title+'** by **'+this.author+'** *('+this.formatViewCount()+' views)* ['+this.formatTime()+']';
};

Track.prototype.fullPrint = function() {
  return this.prettyPrint();
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

module.exports = YoutubeTrack = function(){
	Track.apply(this, arguments);
};

YoutubeTrack.prototype = Object.create(Track.prototype);

YoutubeTrack.getInfoFromVid = function(vid, cb) {
	var requestUrl = "";
	if (vid.indexOf("www.youtube.com") == -1 ){ //Doesn't contain
		requestUrl = 'http://www.youtube.com/watch?v=' + vid;
	}else{
		requestUrl = vid;
	}

	ytdl.getInfo(requestUrl, function(err, info){
	    if (err) cb(err, undefined);
	    else {
		  var f = info.formats;
		  var selection, hb = 0;
		  for (var i=0; i<f.length; i++) {
			  var current = f[i];
			  if (current.type && current.type.indexOf('audio/') > -1) {
				  if (Number(current.audioBitrate) > hb) {
					  hb = Number(current.audioBitrate);
					  selection = current;
				  }
			  }
		  }
		  if (!selection){
			  console.log("Couldn't find stream info for : " + info.title);
		  }

		  var video = new YoutubeTrack(vid, info);
	      video.containedVideo = info;

		  video.url = selection.url;

	      cb(undefined, video);
	    }
	  });
};
