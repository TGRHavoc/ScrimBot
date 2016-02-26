var pullDeployCommand = {
    description: "Fetch code from github and restart the bot",
    process: function (bot, msg, args) {
        bot.sendMessage(msg.channel, "Updating..", function (err, sentMsg) {
            console.log("Updating...");
            var spawn = require("child_process").spawn;
            var fetch = spawn("git", ["fetch"]);
            fetch.stdout.on("data", function (data) {
                console.log("Recived: " + data);
            });

            fetch.on("close", function (code) {
                var reset = spawn('git', ['merge', 'origin/master']); //Merge local with origin
                reset.stdout.on('data', function (data) {
                    console.log(data.toString());
                });
                reset.on("close", function (code) {
                    var npm = spawn('npm', ['install']);
                    npm.stdout.on('data', function (data) {
                        console.log(data.toString());
                    });
                    npm.on("close", function (code) {
                        console.log("goodbye");
                        bot.sendMessage(msg.channel, "brb!", function () {
                            bot.logout(function () {
                                process.exit();
                            });
                        });
                    });
                });
            });

        });
    }
};

module.exports = pullDeployCommand;