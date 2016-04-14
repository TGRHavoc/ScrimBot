var ursa = require("ursa"),
	util = require("../../utils/user.js"),
	fs = require("fs");

var generateCommand = {
	description: "Generate the RSA Public and Private keys for use with the Scrim plugin on the Minecraft Server.",
	permission: function(bot, channelID, userID){
  	  return util.isAdmin( bot, channelID, userID );
    },
	process: function(bot, data, args){
		console.log("Generating...");
		var key = ursa.generatePrivateKey(2048, 65537);
		var privateKey = key.toPrivatePem();
		var publicKey = key.toPublicPem();
		
		console.log("Saving keys to files.");
		fs.writeFileSync("lib/keys/scrimbotPriv.key", privateKey);
		fs.writeFileSync("lib/keys/scrimBotPub.key", publicKey);
	}
};

module.exports = generateCommand;
