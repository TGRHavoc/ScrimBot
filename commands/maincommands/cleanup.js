var util = require("../../utils/user.js");

var cleanCommand = {
  description: "Clean up the channel's chat",
  process: function(bot, msg, args){

    if(!( util.isAdmin( msg.channel.server, msg.author ) )){
      bot.sendMessage(msg.channel, "You cannot control me!");
      return;
    }

    var channel = msg.channel;
    bot.getChannelLogs(channel, 500, function(err, messages){
      for(var i = 0; i<= messages.length; i++){
        bot.deleteMessage(messages[i]);
      }
    });
  }
};
module.exports = cleanCommand;
