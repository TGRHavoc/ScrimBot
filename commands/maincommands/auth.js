var toAuth = {},
	charLower = "abcdefghijklmnopqrstuvwxyz",
	charUpper = charLower.toUpperCase(),
	numbers = "0123456789",
	crypto = require("crypto"),
	config = require("../../config"),
	User = require("../../utils/user");

var authCommand = {
	usage: "<auth code>",
	description: "Authenticate your Minecraft account with ScrimBot",
	process: function(bot, msg, arguments){
		//TODO: No args = show IP to connect to
		var args = arguments.split(" ");
		if(User.hasRole(msg.channel.server, msg.author, "Authenticated")){
			bot.sendMessage(msg, `${msg.author.mention()} You have already authenticated`);
			return;
		}

		if(arguments.length == 0){
			//Send them the IP
			bot.sendMessage(msg, `${msg.author.mention()} You can connect to **${config.auth_ip}** to get your authentication code`);
		}else if (args.length == 1) {
			// args[0] = auth code
		}else{
			//TOO Many args
		}
	},
	init: function(){
		authServer.on("login", function (client) {
			var clientUid = client.uuid, clientName = client.username; //Grab their data
			console.log(`Someone connected: ${clientName}`);

			//TODO: If they're in our files..
			toAuth[clientUid] = generateCode( 10 );

			client.end("Please run the following command in Discord\n§6!auth " + toAuth[clientUid]);
		});
	}
};

function generateCode(lengthI){
    var length = 5, string = "";
    var chars = numbers + charLower + charUpper;

    length = lengthI || 5; //Generate a string with "length" characters (5 =default)

    while (string.length < length) {
        var bf;
        try {
            bf = crypto.randomBytes(length);
        }
        catch (e) {
            continue;
        }
        for (var i = 0; i < bf.length; i++) {
            var index = bf.readUInt8(i) % chars.length;
            string += chars.charAt(index);
        }
    }

    return string;
};

module.exports = authCommand;
