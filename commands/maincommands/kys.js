var usrUtils = require("../../utils/user.js");

var kysCommand = {
  usage: "",
  description: "Quick and easy abbreviation for kill youself.",
  process: function (bot, msg, arguments) {
    if(usrUtils.isAdmin( msg.channel.server, msg.author )){
      bot.sendMessage(msg.channel, ":frowning: kys :skull:", function(err, channel) { if(err) console.log(err); });
      bot.logout(function(err, channel) { if(err) console.log(err); });
      return;
    }

    bot.sendMessage(msg.channel, "kys " + msg.author.name + " :skull:", function(err, channel) { if(err) console.log(err); });
  }
};

module.exports = kysCommand;
