var helpCommand = {
    usage: "",
    description: "Sends you a helpful message with the commands you can use.",
    process: function (bot, msg, arguments) {
    //Process the command here.
    // Bot = Discord.Client object
    // msg = Message object, msg.channel for bot.sendMessage(channel, message)
    // arguments = string of arguments for command (split(" ") for an array)
    }
};

module.exports = helpCommand;
