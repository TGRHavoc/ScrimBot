var toAuth = {},
	charLower = "abcdefghijklmnopqrstuvwxyz",
	charUpper = charLower.toUpperCase(),
	numbers = "0123456789",
	crypto = require("crypto"),
	config = require("../../config"),
	Roles = require("../../utils/roles");

var authCommand = {
	usage: "<auth code>",
	description: "Authenticate your Minecraft account with ScrimBot",
	process: function(bot, msg, arguments){
		//TODO: No args = show IP to connect to
		var args = arguments.split(" ");

		MongoUser.findOne({discordId: msg.user.id}, function(err, user){
			if (err){
				//TODO: Handle
				return;
			}

			console.log("Found user: " + user);
			if (user){
				bot.sendMessage({to: msg.channel.id, message: msg.user.mention() + ", you have already authenticated"});
			}else{
				//User may be null (if not found)

				if(!args[0]){
					//Send them the IP
					bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+ 'You can connect to **'+config.auth_ip+':'+config.auth_port+'** to get your authentication code'});
				}else if (args[0] && args.length == 1) {
					for(uuid in toAuth){
						console.log("uuid: " + uuid);
						var userData = toAuth[uuid];
						if(userData.code == args[0]){
							//Authenticate them
							var mongoData = new MongoUser({
								discordId: msg.user.id,
								uuid: uuid,
								minecraftName: userData.name
							});
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

								bot.sendMessage({to: msg.channel.id, message: msg.user.mention()+'. Thank you for authenticating!'});
							}else{
								//Couldn't add them!
							}

							mongoData.save();
							delete toAuth[uuid];
							//bot.sendMessage({to: msg.channel.id, message: msg.user.mention() + ". Thanks for authenticating!"})

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

			}

		});
	},
	init: function(){
		authServer.on("login", function (client) {
			var clientUid = client.uuid, clientName = client.username; //Grab their data
			console.log('Someone connected: ' + clientName + ":" + clientUid );

			MongoUser.findOne({uuid: clientUid}, function(err, user){
				console.log("Finding one...");
				if (err){
					console.log(err);

					client.end("Error authenticating");
					return;
				}
				console.log("User: " + user);
				if (user){
					client.end("You have already Authenticated");
					return;
				}else{
					var code = generateCode( 5 );
					toAuth[clientUid] = {"code": code, "name": clientName };

					client.end("Please run the following command in Discord\n§6!auth " + code);
				}

			});
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
