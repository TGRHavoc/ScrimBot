var request = require("request");

var pollCommand = {
	description: "Start a strawpoll",
	process: function(bot, msg, arguments) {
		if (arguments && /^[^, ](.*), ?(.*)[^, ]$/.test(arguments)) {
			arguments = msg.cleanContent.substring(msg.cleanContent.indexOf(" ") + 1).split(/, ?/);
			request.post(
				{
					"url": "https://strawpoll.me/api/v2/polls",
					"headers": {"content-type": "application/json"},
					"json": true,
					body: {
						"title": "" + msg.author.username + "'s Poll",
						"options": arguments
					}
				},
				function(error, response, body) {
					if (!error && response.statusCode == 201) {
						bot.sendMessage(msg, msg.author.mention() + " created a strawpoll. Vote here: http://strawpoll.me/" + body.id);
					} else if (error) { bot.sendMessage(msg, error);
					} else if (response.statusCode != 201) { bot.sendMessage(msg, "Got status code " + response.statusCode); }
				}
			);
		}
	}
};


module.exports = pollCommand;
