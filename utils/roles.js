var Role = {};


Role.getRoleFromName = function ( server, roleName ){
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
	var users = server.membersWithRole(roleName);

	if(users.length > 0){
		return true; //Probably exists
	}

	return false
};


module.exports = Role;
