var _ballCommand = {
	usage: "[question]",
	description: "Ask the magic 8ball anything!",
	process: function(bot, msg, question){
		var responses = ["It is certain", "Without a doubt", "You may rely on it", "Most likely", "Yes", "Signs point to yes", "Better not tell you now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
		var choice = Math.floor(Math.random() * (responses.length));
		bot.sendMessage(msg, ":8ball: " + responses[choice]);
	}
};

module.exports = _ballCommand;
