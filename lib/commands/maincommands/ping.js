var pingCommand = {
  usage: "",
  description: "Pings your pong.",
  process: function (bot, msg, arguments) {
	   bot.sendMessage(msg.channel, "Pong!", function(err, channel) { if(err) console.log(err); });
   }
};

module.exports = pingCommand;
