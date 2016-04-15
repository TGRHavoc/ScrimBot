var usrUtils = require("../../utils/user.js");

var kysCommand = {
  usage: "",
  description: "Quick and easy abbreviation for kill youself. Stops the bot from running (doesn't disconnect).",
  permission: function(bot, channelID, userID){
	  return usrUtils.isAdmin(bot, channelID, userID);
  },
  process: function (bot, data, arguments) {
	  console.log("Leaving: " + data.channel.id);

	  //Send the "kys" message then exit the program..
	  bot.sendMessage({to: data.channel.id, message: "kys " + data.user.name + " :skull:"},
	  function(err){
		 exitHandler({exit: true}, err);
	  });
  }
};

module.exports = kysCommand;
