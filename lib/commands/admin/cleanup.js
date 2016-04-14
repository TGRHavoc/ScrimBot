var util = require("../../utils/user.js");

var cleanCommand = {
  description: "Delete the last 50 messages from a text channel",
  permission: function(bot, channelID, userID){
	  return util.isAdmin( bot, channelID, userID );
  },
  process: function(bot, data, args){
	  var messages = bot.getMessages({channel: data.channel.id, limit: 50}, function(err, messageArr){
		 if(err){
			 console.log("Error cleaning: " + err);
			 return;
		 }

		 console.log("Cleaning " + messageArr.length +" messages");
		 for(var i = 0; i < messageArr.length; i++){
			 var message = messageArr[i];
			 bot.deleteMessage({channel: message.channel_id, messageID: message.id});
			 console.log("Deleted message " + i);
		 }
		 console.log("Cleaned!");
		 bot.sendMessage({to: data.user.id, message: "I've cleaned the last "+ messageArr.length +" messages in the channel " + data.channel.id});

	  });
  }
};
module.exports = cleanCommand;
