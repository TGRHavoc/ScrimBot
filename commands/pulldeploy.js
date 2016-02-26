var pullDeployCommand = {
    description: "Fetch code from github and stop the bot",
    process: function (bot, msg, args) {
      bot.sendMessage(msg.channel,"Updating...",function(error,sentMsg){
            console.log("updating...");
            var spawn = require('child_process').spawn;

            var fetch = spawn('git', ['fetch']);
            fetch.stdout.on('data',function(data){
                console.log(data.toString());
            });

            fetch.on("close",function(code){
                var reset = spawn('git', ['reset','--hard','origin/master']);
                reset.stdout.on('data',function(data){
                    console.log(data.toString());
                });
                reset.on("close",function(code){
                    console.log("goodbye");
                    bot.updateMessage(sentMsg,"Brb!",function(){
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
