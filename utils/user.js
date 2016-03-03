var User = {},
	Roles = require('./roles');

User.isAdmin = function(server, user){
  var userRoles = server.rolesOfUser(user);
  var isAdmin = false;
  for(var i=0; i<userRoles.length; i++){
    var role = userRoles[i];
    if (role.name.toLowerCase() == "admins" || role.name.toLowerCase() == "admin" )
      isAdmin = true;
  }

  return isAdmin;
};

User.hasRole = function(server, user, roleName){
	var userRoles = server.rolesOfUser(user);
	for(var i=0; i<userRoles.length; i++){
		var r = userRoles[i];
		if(r.name == roleName)
			return true;
	}

	return false;
};


module.exports = User;
