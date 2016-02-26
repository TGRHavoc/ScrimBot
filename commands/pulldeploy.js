var pullDeployCommand = {
    description: "Fetch code from github and restart the bot",
    process: function (bot, msg, args) {
        bot.sendMessage(msg.channel, "Updating..", function (err, sentMsg) {
            console.log("Updating...");
            var spawn = require("child_process").spawn;
            var fetch = spawn("git", ["fetch", "origin", "origin/master"]);
            fetch.stdout.on("data", function (data) {
                console.log("Recived: " + data);
            });

            fetch.on("close", function (code) {
                var reset = spawn('git', ['checkout', 'origin/master']); //Merge local with origin
                console.log("Restarting..");

                reset.stdout.on('data', function (data) {
                    console.log("checkout Recieved:" + data.toString());
                });

                reset.on("close", function (code) {
                    bot.updateMessage(sentMsg, "Shutting down... I've been updated");
                });
            });

        });
    }
};

module.exports = pullDeployCommand;