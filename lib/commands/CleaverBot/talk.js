var Cleverbot = require('cleverbot-node');

var cleverbot = require("cleverbot-node");
talkbot = new cleverbot;
cleverbot.prepare(function(){});

var talkCommand = {
  usage: "[message]",
  description: "Talk directly to the bot",
  process: function(bot, msg, args){
    var convo = args.split(" ");
    talkbot.write(convo, function(response){
      bot.sendMessage(msg.channel, response.message);
    });
  }
};

module.exports = talkCommand;
