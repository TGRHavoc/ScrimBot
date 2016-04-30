var ytdl = require("ytdl-core"),
	spawn = require("child_process").spawn;

var Queue = [];// Queue of videos to play

var playCommand = {
	usage: "<youtube video id(s)>",
	description: "Play a YouTube video's audio",
	permission: function(bot, channelID, userID){
		return false;
	},
	process: function(bot, msg, args){
		//return;
		return;
		args = args.split(" ");
		//TODO: Check they can do this command?
		if (!args[0]){
			if (Queue.length >= 1)
				playNext(bot, msg);
			bot.sendMessage({to: msg.channel.id, message:"Please specify a YouTube video ID. E.g. PivWY9wn5ps"});
			return;
		}

		var server = bot.servers[bot.serverFromChannel(msg.channel.id)];
		var member = server.members[bot.id];

		if (!member.voice_channel_id){
			bot.sendMessage({to: msg.channel.id, message: "I'm not in a voice channel. Please use the join command first!"});
			return;
		}

		bot.setPresence({game: null});
		var successful = 0;
		for (var i = 0; i < args.length; i++){
			YoutubeTrack.getInfoFromVid(args[i], msg, function(err, video){
				if(err){
					console.log("Play error: " + err);
					bot.sendMessage({to: msg.channel.id, message: 'Error queuing video: ' + err});
					return;
				}
				
				var pos = Queue.push(video);
				successful++;
				//bot.sendMessage({to: msg.channel.id, message: "I have queued **" + video.title + "** it's in position " + pos });
				if (Queue.length >= 1 && (typeof currentlyPlayingSong == "undefined" || currentlyPlayingSong == null)){
					playNext(bot, msg);
				}else if (Queue.length > 1){
					nextSong = Queue[1]; //Make sure the next song is set
				}
			});
		}

		bot.sendMessage({to: msg.channel.id, message: "I have successfully queued " + successful + " songs."});

	}
};

function playNext(bot, msg){
	var server = bot.servers[bot.serverFromChannel(msg.channel.id)];
	var member = server.members[bot.id];

	var video = Queue[0];

	bot.getAudioContext({channel: member.voice_channel_id, stereo: true}, function(stream){
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
			nextSong = Queue[1];

			console.log("Next: "+ (typeof nextSong == "undefined" ? "N/A" : nextSong.title));
		});

		ffmpeg.stdout.once("end", function(){

			bot.setPresence({game:null});
			//bot.sendMessage({to: msg.channel.id, message:'Finished playing: **'+video.title+'**'});

			Queue.shift();

			ffmpeg.kill();
			console.log("Queue lenth: " + Queue.length);
			if (Queue.length >= 1){
				return playNext(bot, msg);
			}
		});

	});

};

module.exports = playCommand;
