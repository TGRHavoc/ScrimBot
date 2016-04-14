var Cleverbot = require('cleverbot-node');

var cleverbot = require("cleverbot-node");
talkbot = new cleverbot;
cleverbot.prepare(function(){});

var talkCommand = {
  usage: "[message]",
  description: "Talk directly to the bot",
  process: function(bot, data, args){
    var convo = args.split(" ");
    talkbot.write(convo, function(response){
		bot.sendMessage({to: data.channel.id, message: response.message});
    });
  }
};

module.exports = talkCommand;
