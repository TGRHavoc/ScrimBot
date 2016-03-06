var usrUtils = require("../../utils/user.js");

var kysCommand = {
  usage: "",
  description: "Quick and easy abbreviation for kill youself.",
  permission: function(msg){
	  return usrUtils.isAdmin(msg.channel.server, msg.author);
  },
  process: function (bot, msg, arguments) {
    if(usrUtils.isAdmin( msg.channel.server, msg.author )){ //Not going to be called anymore.. Remove at some point.
      bot.sendMessage(msg.channel, ":frowning: kys :skull:", function(err, channel) { if(err) console.log(err); });
      bot.logout(function(err, channel) { if(err) console.log(err); });
      return;
    }

	bot.sendMessage(msg.channel, "kys " + msg.author.name + " :skull:", function(err, channel) { if(err) console.log(err); });
  }
};

module.exports = kysCommand;
