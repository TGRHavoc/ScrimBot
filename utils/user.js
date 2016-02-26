var User = {};

User.isAdmin = function(server, user){
  var userRoles = server.rolesOfUser(user);
  var isAdmin = false;
  for(var i=0; i<userRoles.length; i++){
    var role = userRoles[i];
    if (role.name == "Admins")
      isAdmin = true;
  }
  
  return isAdmin;
};


module.exports = User;
