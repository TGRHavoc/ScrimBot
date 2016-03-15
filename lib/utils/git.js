var config = require("../config"),
	request = require("request");

const BASE_URL = "https://api.github.com";

function getMaps(callback){
	var url = BASE_URL + "/repos/" + config.rotation.git_user + "/"+ config.rotation.git_repo_name + "/contents/"+ config.rotation.map_file_name;
	console.log("Getting from: " + url);
	var options = {
		"url" : url,
		headers: {
			"User-Agent" : "ScrimBot"
		}
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var content = new Buffer(json.content, json.encoding).toString();
			console.log(content);
			if (callback)
				return callback(null, content.split("\n"));
			else
				return null;
		}

		if (callback)
			callback(error, null)
	});
};

module.exports = getMaps;
