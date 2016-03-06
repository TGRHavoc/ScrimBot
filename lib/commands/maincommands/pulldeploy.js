var userUtil = require("../../utils/user.js");

var pullDeployCommand = {
    description: "Fetch code from github and stop the bot",
	permission: function(msg){
		return userUtil.isAdmin(msg.channel.server, msg.author);
	},
    process: function (bot, msg, args) {

    //   if(!( userUtil.isAdmin( msg.channel.server, msg.author ) )){
    //     bot.sendMessage(msg.channel, "You cannot control me!");
    //     return;
    //   }

      bot.sendMessage(msg.channel,"Updating...",function(error,sentMsg){
            console.log("updating...");
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

                    bot.updateMessage(sentMsg,"Applying update:\n" + updates,function(){
                      if (updates == "Already up-to-date.")
                        return;

                      bot.logout(function(){
                        process.exit();
                      });
                    });
                });

            });
        });
    }
};

module.exports = pullDeployCommand;
