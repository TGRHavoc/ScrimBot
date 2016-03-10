var util = require("../../utils/user.js");

var cleanCommand = {
  description: "Clean up the channel's chat",
  permission: function(msg){
	  return util.isAdmin( msg.channel.server, msg.author );
  },
  process: function(bot, msg, args){
    var channel = msg.channel;
    bot.getChannelLogs(channel, 500, function(err, messages){
      for(var i = 0; i<= messages.length; i++){
        bot.deleteMessage(messages[i]);
      }
    });
  }
};
module.exports = cleanCommand;
