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

		if(User.hasRole(bot, msg.channel.id, msg.user.id, "Authenticated")){
			bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+ 'You have already authenticated'});
			return;
		}

		if(!args[0]){
			//Send them the IP
			bot.sendMessage({to: msg.channel.id, message: msg.author.mention()+ 'You can connect to **'+config.auth_ip+'** to get your authentication code'});
		}else if (args[0] && args.length == 1) {
			for(uuid in toAuth){
				var userData = toAuth[uuid];
				if(userData.code == args[0]){
					//Authenticate them
					console.log("Adding to arrays..");
					Assosiations.push({"discordId": msg.user.id, "uuid": uuid});
					McData.push({"uuid": uuid, "name": userData.name});

					console.log("Sorting arrays");
					Assosiations = sort(Assosiations, "discordId");
					McData = sort(McData, "uuid");
					console.log("Arrays sorted.");

					//bot.addMemberToRole(msg.author, Roles.getRoleFromName(msg.channel.server, "Authenticated"));

					var r = Roles.getRoleId(bot, msg.channel.id, "Authenticated")
					if (r != null){
						bot.addToRole({
							server: bot.serverFromChannel(msg.channel.id),
							user: msg.user.id,
							role: r
						}, function(err, resp){

							if (err){
								console.log("Error adding user to group: " + err);
							}

						});

						bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+' Thank you for authenticating!'});
					}else{
						//Couldn't add them!
					}

					return;
				}else
					continue;
			}

			//Couldn't auth
			bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+' I\'m sorry but, that code doesn\'t work. Please try again.'});

		}else{
			//TOO Many args
			bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+' You only need to give me your Authentication code'});
		}
	},
	init: function(){
		authServer.on("login", function (client) {
			var clientUid = client.uuid, clientName = client.username; //Grab their data
			console.log('Someone connected: ' + clientName );

			//TODO: If they're in our files..
			var user = search.search(McData, "uuid", clientUid);
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
