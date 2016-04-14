var pongCommand = {
  usage: "",
  description: "Pongs your pong.",
  process: function (bot, msg, arguments) {
	   bot.sendMessage({to: msg.channel.id, message: "I hear " + msg.user.name + " likes cute asian boys"});
   }
};

module.exports = pongCommand;
