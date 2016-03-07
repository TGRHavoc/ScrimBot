var ursa = require("ursa"),
	util = require("../../utils/user.js"),
	fs = require("fs");

var generateCommand = {
	description: "Generate the RSA Public and Private keys for use with the Scrim plugin on the Minecraft Server.",
	permission: function(msg){
  	  return util.isAdmin( msg.channel.server, msg.author );
    },
	process: function(bot, msg, args){
		console.log("Generating...");
		var key = ursa.generatePrivateKey(1024, 65537);
		var privateKey = key.toPrivatePem();
		var publicKey = key.toPublicPem();

		console.log("Saving keys to files.");
		fs.writeFileSync("lib/keys/scrimbotPriv.key", privateKey);
		fs.writeFileSync("lib/keys/scrimBotPub.key", publicKey);
	}
};

module.exports = generateCommand;
