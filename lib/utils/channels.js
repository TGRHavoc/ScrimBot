var Channels = {};

Channels.GetChannel = function(bot, data, channelName){
	var server = bot.servers[bot.serverFromChannel(data.channel.id)];
	console.log(JSON.stringify(server.channels));

	for(var i in server.channels){

		var channel = server.channels[i];
		console.log("Channel : " + channel.name);
		if(channel.name == channelName){
			return channel;
		}
	}

	return null;
};


module.exports = Channels;
