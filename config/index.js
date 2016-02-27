var Config = {
    auth: require("./auth.json"), //This will return the object in the JSON file
	help: require('./help.json')
};

//Module.exports is what is returned when you do require("FILE.js").
//In this example, we return the Config object.
//This allows us to do stuff like require("config.js").auth to get the data in auth.json
module.exports = Config;
