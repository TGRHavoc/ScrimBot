var echoCommand = {
  usage: "",
  description: "Echo echo echo..",
  process: function (bot, msg, arguments) {
    var roles = bot.servers[0].rolesOf(msg.author);
    for (var role in roles) {
      if (role = "Admins") {
        bot.sendMessage(msg.channel, arguments, function(err, channel) { if(err) console.log(err); });
        return;
      }
    }
  }
};

module.exports = echoCommand;
