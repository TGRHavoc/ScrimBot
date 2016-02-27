var helpCommand = {
    usage: "[page number]",
    description: "Displays a helpful message about commands and stuff",
    process: function (bot, msg, arguments) {
    //Process the command here.
    // Bot = Discord.Client object
    // msg = Message object, msg.channel for bot.sendMessage(channel, message)
    // arguments = string of arguments for command (split(" ") for an array)
    }
};

module.exports = helpCommand;
