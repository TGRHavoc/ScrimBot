var teamCommand = {
  usage: "",
  description: "A shot at teams.. and roles.",
  process: function (bot, msg, arguments) {
    var args = arguments.split(" ");
    if (args.length >= 2){
      var roleName = args[1];
      if (args[0] == "create") {

        var permis = ["sendMessages", "attachFiles"];
        var roleobj = {color:0xFF66FF, hoist :false, name:roleName, permissions:permis};
        var callbackFunc = function(err, role) {
          if(err)
            console.log(err);
          bot.addUserToRole(msg.author, role, function(err, channel) { if(err) console.log(err); });
          bot.sendMessage(msg.channel, "Created role of " + roleName, function(err, channel) { if(err) console.log(err); });
          return;
        };

        bot.createRole(bot.servers[0], roleobj, callbackFunc);
      }
    }
  }
};

module.exports = teamCommand;
