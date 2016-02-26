var packageInfo = require("../../package.json");

function getFormattedString(){
  var toFormat = "Hi! I'm {name}.\n"+
                  "Currently I'm version {version} but, my creators will update me soon!\n" +
                  "My creators:\n";

  toFormat += "\t{author_name} ({author_email})\n".format({author_name: packageInfo.author.name, author_email: packageInfo.author.email});

  for(var i = 0; i<packageInfo.contributors.length; i++){
      var c = packageInfo.contributors[i];
      toFormat += "\t{name} ({email})\n".format({name: c.name, email: c.email});
  }
  
  return toFormat.format({name: packageInfo.name, version: packageInfo.version});
}

var whoAmICommand = {
  description: "Get to know the bot more",
  process: function(bot, msg, args){
    bot.sendMessage(msg.channel, getFormattedString());
  }
};

module.exports = whoAmICommand;
