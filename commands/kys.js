var kysCommand = {
  usage: "",
  description: "Quick and easy abbreviation for kill youself.",
  process: function (bot, msg, arguments) {
    var roles = bot.servers[0].rolesOf(msg.author);
    for (var role in roles) {
      if (role = "Admins") {
        bot.sendMessage(msg.channel, ":frowning: kys :skull:", function(err, channel) { if(err) console.log(err); });
        bot.logout(function(err, channel) { if(err) console.log(err); });
        return;
      }
    }
    bot.sendMessage(msg.channel, "kys " + msg.author.name + " :skull:", function(err, channel) { if(err) console.log(err); });
  }
};

module.exports = kysCommand;
