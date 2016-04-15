var pingCommand = {
  usage: "",
  description: "Pings your pong.",
  process: function (bot, msg, arguments) {
	   bot.sendMessage({to: msg.channel.id, message: "Pong!"});
   }
};

module.exports = pingCommand;
