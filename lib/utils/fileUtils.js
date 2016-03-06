var fs = require('fs'),
	path = require("path");

makeDir = function(dir){
	return fs.mkdirSync(dir);
}

dirExists = function(dir){
	return fs.statSync(dir).isDirectory();
}

createFile = function(file){
	return fs.closeSync(fs.openSync(file, "w"));
};

fileExists = function(file){
	return fs.existsSync(file);
};

//Async read file (calls callback when done);
readFile = function(file, options, callback){
	if(callback == null){
		callback = options;
		options = {};
	}
	fs.readFile(file, options, function(err, data){
		if(err)
			return callback(err);
		var obj;
		try {
			obj = JSON.parse(data);
		} catch (e) {
			e.message = file + ": " + e.message;
			return callback(e);
		}

		return callback(null, obj);
	});
};

readFileSync = function(file, options){
	options = options || {};
	var shouldThrowError = 'throws' in options ? options.throw : false;//Fail silently by default
	var fileContent = fs.readFileSync(file, options);
	try{
		return JSON.parse(content);
	}catch(e){
		if(shouldThrowError){
			e.message = file + ": " + e.message;
			throw e;
		}else{
			return {}; //Return an empty obj
		}
	}
};

writeFile = function(file, obj, options, callback){
	if(callback == null){
		callback = options;
		options = {};
	}
	var spaces = typeof options === "object" && options != null
				? 'spaces' in options
				? options.spaces : 4
				: 4;
	var str = "";
	try {
		str = JSON.stringify(obj, null, spaces) + "\n";
	} catch (e) {
		if (callback)
			return callback(err,  null);
	}

	fs.writeFile(file, str, options, callback);
};

writeFileSync = function(file, obj, options){
	options = options || {};
	var spaces = typeof options === "object" && options != null
				? 'spaces' in options
				? options.spaces : 4
				: 4;
	var str = JSON.stringify(obj, null, spaces) + "\n";
	fs.writeFileSync(file, str, options);
};

var fileUtils = {
	dirExists: dirExists,
	makeDir: makeDir,
	fileExists: fileExists,
	createFile: createFile,
	readFile: readFile,
	readFileSync: readFileSync,
	writeFile: writeFile,
	writeFileSync: writeFileSync
};

module.exports = fileUtils;
