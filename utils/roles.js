var Role = {};


Role.getRoleFromName = function ( server, roleName ){
	console.log("server: "+ server);

	if ( Role.roleExists(server, roleName) ){
		var allRoles = server.roles;
		for(var i = 0; i<allRoles.length; i++){
			if (allRoles[i].name == roleName)
				return allRoles[i];
		}
		return null;
	}else{
		return null;
	}
};

Role.roleExists = function( server, roleName ){
	//var users = server.usersWithRole(roleName);
	for(var i =0; i< server.roles.length; i++){
		if (server.roles[i].name == roleName)
			return true;
	}

	return false
};


module.exports = Role;
