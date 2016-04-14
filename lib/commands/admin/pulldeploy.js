var userUtil = require("../../utils/user.js");

var pullDeployCommand = {
    description: "Fetch code from github and stop the bot - DEPRECATED",
	permission: function(bot, channelID, userID){
		return userUtil.isAdmin(bot, channelID, userID);
	},
    process: function (bot, data, args) {
		return;
    //   if(!( userUtil.isAdmin( msg.channel.server, msg.author ) )){
    //     bot.sendMessage(msg.channel, "You cannot control me!");
    //     return;
    //   }
/*
      bot.sendMessage({to: data.channel.id, message: "Updating..."},function(error,sentMsg){
            console.log("updating... " + sendMsg);
            var spawn = require('child_process').spawn;

            var fetch = spawn('git', ['fetch']);
            fetch.stdout.on('data',function(data){
                console.log(data.toString());
            });

            fetch.on("close",function(code){
                var reset = spawn('git', ['merge', 'origin/master']);
                var updates;
                reset.stdout.on('data',function(data){
                    console.log(data.toString());
                    updates = data;
                });
                reset.on("close",function(code){
                    console.log("goodbye");
					exitHandler({exit: true}, null);
                });

            });
        });
		*/
    }
};

module.exports = pullDeployCommand;
