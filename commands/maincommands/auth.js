var toAuth = {},
	charLower = "abcdefghijklmnopqrstuvwxyz",
	charUpper = charLower.toUpperCase(),
	numbers = "0123456789",
	crypto = require("crypto"),
	config = require("../../config"),
	User = require("../../utils/user"),
	Roles = require("../../utils/roles"),
	sort = require("../../utils/algo/mergeSort"),
	search = require("../../utils/algo/binarySearch");

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

		if(!args[0]){
			//Send them the IP
			bot.sendMessage(msg, `${msg.author.mention()} You can connect to **${config.auth_ip}** to get your authentication code`);
		}else if (args[0] && args.length == 1) {
			for(uuid in toAuth){
				var userData = toAuth[uuid];
				if(userData.code == args[0]){
					//Authenticate them
					console.log("Adding to arrays..");
					Assosiations.push({"discordId": msg.author.id, "uuid": uuid});
					McData.push({"uuid": uuid, "name": userData.name});
					console.log("Added the data: " + JSON.stringify(McData));

					if (!(Assosiations.length <= 1 && Data.length <= 1)){
						console.log("Sorting arrays: " + JSON.stringify(Assosiations));
						var ta = sort(Assosiations, "discordId");
						var td = sort(McData, "uuid");
						console.log("Sorted arrays: " + JSON.stringify(Assosiations));
					}

					bot.addMemberToRole(msg.author, Roles.getRoleFromName("Authenticated"));

					bot.sendMessage(msg, `${msg.author.mention()} Thank you for authenticating!`);
					return;
				}else
					continue;
			}

			//Couldn't auth
			bot.sendMessage(msg, `${msg.author.mention()} I'm sorry but, that code doesn't work. Please try again.`);

		}else{
			//TOO Many args
			bot.sendMessage(msg, `${msg.author.mention()} You only need to give me your Authentication code`);
		}
	},
	init: function(){
		authServer.on("login", function (client) {
			var clientUid = client.uuid, clientName = client.username; //Grab their data
			console.log(`Someone connected: ${clientName}`);

			//TODO: If they're in our files..
			var user = search(McData, "uuid", clientUid);
			if (user != -1){
				client.end("You have already Authenticated");
				return;
			}

			//Generate their auth details
			var code = generateCode( 5 );
			toAuth[clientUid] = {"code": code, "name": clientName };

			client.end("Please run the following command in Discord\n§6!auth " + code);
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
