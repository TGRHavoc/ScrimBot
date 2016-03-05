var pongCommand = {
  usage: "",
  description: "Pongs your pong.",
  process: function (bot, msg, arguments) {
	   bot.sendMessage(msg.channel, "I hear " + msg.author.name + " likes cute asian boys", function(err, channel) { if(err) console.log(err); });
   }
};

module.exports = pongCommand;
