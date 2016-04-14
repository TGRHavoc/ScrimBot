var User = {},
	Roles = require('./roles');

User.isAdmin = function(bot, channelID, userID){
	console.log("isAdmin has been called!");
	return User.hasRole(bot, channelID, userID, "Admins");
};

User.hasRole = function(bot, channelID, userID, rolename){
	console.log("Checking user " + userID + " has role " + rolename);
	var server = bot.servers[bot.serverFromChannel(channelID)];

	var userData = server.members[userID];
	console.log("UserData: " + JSON.stringify(userData));

	for ( var i = 0; i < userData.roles.length; i++ ){
		var role = server.roles[userData.roles[i]];
		console.log(role.name +" = " + rolename + ": " + (role.name == rolename));
		if (role.name == rolename){
			return true;
		}
	}

	return false;
};


module.exports = User;
