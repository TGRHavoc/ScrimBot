var Cleverbot = require('cleverbot-node');

var cleverbot = require("cleverbot-node");
talkbot = new cleverbot;
cleverbot.prepare(function(){});


module.exports.chat = function(bot, msg, message){
    var convo = message.split(" ");
    talkbot.write(convo, function(response){
      bot.sendMessage(msg.channel, response.message);
    });
};
