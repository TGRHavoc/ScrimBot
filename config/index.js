var Config = {
	auth_ip: "localhost", //Public IP of the bot for players to connect with MC client
    auth: require("./auth.json"), //This will return the object in the JSON file
	help: require('./help.json'),
	team: require("./team.json")
};

//Module.exports is what is returned when you do require("FILE.js").
//In this example, we return the Config object.
//This allows us to do stuff like require("config.js").auth to get the data in auth.json
module.exports = Config;
