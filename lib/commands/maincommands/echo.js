var utils = require("../../utils/user.js");

var echoCommand = {
  usage: "",
  description: "Echo echo echo..",
  permission: function(bot, channelID, userID){
	  console.log("Echo permission = " + utils.isAdmin(bot, channelID, userID) );
	  return utils.isAdmin(bot, channelID, userID);
  },
  process: function (bot, data, arguments) {
	  bot.sendMessage({to: data.channel.id, message: arguments});
  }
};

module.exports = echoCommand;
