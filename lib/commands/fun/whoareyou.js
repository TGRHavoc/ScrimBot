var packageInfo = require("../../../package.json");

function getFormattedString(){
  var toFormat = 'Hi! I\'m '+ packageInfo.name+'.\n'+
                  'Currently I\'m version '+packageInfo.version+' but, my creators will update me soon!\n' +
                  "My creators:\n";

  toFormat += '\t'+packageInfo.author.name+' ('+packageInfo.author.email+')\n';

  for(var i = 0; i<packageInfo.contributors.length; i++){
      var c = packageInfo.contributors[i];
      toFormat += '\t'+c.name+' ('+c.email+')\n';
  }

  return toFormat;
}

var whoAmICommand = {
  description: "Get to know the bot more",
  process: function(bot, msg, args){
    bot.sendMessage(msg.channel, getFormattedString());
  }
};

module.exports = whoAmICommand;
