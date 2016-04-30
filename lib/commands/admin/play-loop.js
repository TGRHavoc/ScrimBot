var Youtube = require("../../utils/youtube"),
	config = require("../../config"),
	async = require("async"),
	spawn = require("child_process").spawn,
	channelUtil = require("../../utils/channels");

var Queue = [],
	currentSongId = 0;

var command = {
	description: "Makes bot loop music in channel.",
	permission: function(bot, channelID, userID){
		var userUtil = require("../../utils/user");
		return userUtil.isAdmin(bot, channelID, userID);
    },
	init: function(){
		var calls = [];

		var playlistData = require("../../config/playlist");

		playlistData.urls.forEach(function(url){
			calls.push(function(callback){
				//console.log("Getting info for: " + url);
				Youtube.getInfoFromVid(url, function(err, video){
					if (err){
						console.log(url + " is fucking up");
						callback(err, null);
					}else{
						var pos = Queue.push(video);
						console.log("Added " + video.title + " to " + pos);
						callback(null, "Added video");
					}
				});
			});
		});

		console.log("Waiting for " + calls.length + " functions to complete");
		async.parallel(calls, function(err, result) {
		    if (err)
		        return console.log("Some error: " + err);
		    //console.log(result);
			console.log("I've now got " + Queue.length + " songs!");
		});

	},
	process: function(bot, msg, args){
		args = args.split(" ");

		if(typeof currentlyPlayingSong == "undefined" || !currentlyPlayingSong){
			var toJoin = channelUtil.GetChannel(bot, msg, config.general.music_voice_channel);
			bot.joinVoiceChannel(toJoin.id, function(){
				playNext(bot, msg, toJoin.id);
			});

			return;
		}

		//Already playing...
		console.log("I'm already playing the songs!");
	}
};


function playNext(bot, msg, channelId){

	var video = Queue[currentSongId];
	//Next song to be played
	console.log("currentSongId: " + currentSongId);
	currentSongId = (currentSongId + 1) % Queue.length;

	bot.getAudioContext({channel: channelId, stereo: true}, function(stream){
		var ffmpeg = spawn('ffmpeg' , [
			'-i', video.url,
			'-f', 's16le',
			'-ar', '48000',
			'-ac', '2',
			'pipe:1'
		], {stdio: ['pipe', 'pipe', 'ignore']});

		console.log("Trying to play: " + video.title);
		ffmpeg.stdout.once("readable", function(){
			stream.send(ffmpeg.stdout);

			bot.setPresence({game: video.title});
			//bot.sendMessage({to: msg.channel.id, message: "Playing: " + video.prettyPrint()});

			currentlyPlayingSong = video;
			nextSong = Queue[currentSongId]; // currentSongId has already been incremented

			console.log("Next: "+ (typeof nextSong == "undefined" ? "N/A" : nextSong.title));
		});

		ffmpeg.stdout.once("end", function(){

			bot.setPresence({game:null});
			//bot.sendMessage({to: msg.channel.id, message:'Finished playing: **'+video.title+'**'});

			ffmpeg.kill();
			return playNext(bot, msg, channelId);
		});

	});

};


module.exports = command;
