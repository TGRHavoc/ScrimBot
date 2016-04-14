var request = require("request");

var pollCommand = {
	description: "Start a strawpoll",
	process: function(bot, msg, arguments) {
		if (arguments && /^[^, ](.*), ?(.*)[^, ]$/.test(arguments)) {
			console.log("Arguments: " + arguments);
			arguments = arguments.split(/, ?/);
			//bot.deleteMessage(msg); //Delete the original message?
			request.post(
				{
					"url": "https://strawpoll.me/api/v2/polls",
					"headers": {"content-type": "application/json"},
					"json": true,
					body: {
						"title": "" + msg.user.name + "'s Poll",
						"options": arguments
					}
				},
				function(error, response, body) {
					if (!error && response.statusCode == 201) {
						bot.sendMessage({to: msg.channel.id, message: msg.user.mention() + " created a strawpoll. Vote here: http://strawpoll.me/" + body.id});
					} else if (error) { bot.sendMessage({to: msg.channel.id, message: error});
				} else if (response.statusCode != 201) {
					 bot.sendMessage({to: msg.channel, message: "Got status code " + response.statusCode});
				}
			 }
		 );
	 }
 }
};


module.exports = pollCommand;
