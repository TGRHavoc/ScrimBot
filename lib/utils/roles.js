// TODO: Update ???
var Role = {};


Role.getRoleId = function(bot, channelID, rolename) {
	var server = bot.servers[bot.serverFromChannel(channelID)];
	console.log("Roles: " + JSON.stringify(server.roles))
	for (var key in server.roles){
		var role = server.roles[key];
		console.log(role.name +" = " + rolename + ": " + (role.name == rolename));
		if (role.name == rolename){
			return role.id;
		}
	}

	return null;
};



module.exports = Role;
