var express = require('express'),
	config = require("../../config"),
	bodyParser = require("body-parser"),
	app = express(),
	fs = require('fs'),
	search = require("../algo/binarySearch"),
	sort = require("../algo/mergeSort"),
	ursa = require("ursa"),
	crypto = require("crypto");

var currentTokens = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

app.get("/user/:discordId", function(req, res){
	var discordId = req.param.discordId;
	var assosiation = search.search(Assosiations, "discordId", discordId);

	if(assosiation == -1)
	{
		res.end(JSON.stringify({error: true, message: 'Association could not be found'}));
		return;
	}
	var mcUid = assosiation.uuid;
	var data = search.search(McData, "uuid", mcUid);

	if(data == -1){
		res.end(JSON.stringify({error: true, message: 'UUID not found... This is fucked. Please tell Havoc or Andrew'}));
		return;
	}

	res.end(JSON.stringify(data));
	console.log("Sent data");
});

app.get("/token/:uniqueId", function(req, res){
	currentTokens[req.params.uniqueId] = crypto.randomBytes(20).toString("hex"); //Our "true" token

	var publicKey = ursa.createPublicKey(fs.readFileSync("lib/keys/scrimBotPub.key"));
	var encrypted = publicKey.encrypt(currentTokens[req.params.uniqueId], 'hex', 'base64', ursa.RSA_PKCS1_PADDING);
	res.end(JSON.stringify({id: req.params.uniqueId, token: encrypted}));
});

app.post("/update/:id", function(req, res){
	var userData = search.search(McData, "uuid", req.params.id);
	
	if (userData == -1){
		res.end(JSON.stringify({error: true, message: "Couldn't find anyone with uuid '" + req.params.id + "'"}));
		return;
	}
	req.body.data = req.body.data.replaceAll(' ', '+');
	//console.log("Method: " + req.method);
	console.log("Headers: " + JSON.stringify(req.headers));
	if(!req.body){
		res.sendStatus(400);
		res.end();
		return;
	}

	if(!req.body.token || !req.body.uniqueId || !(req.body.uniqueId in currentTokens) ){
		res.sendStatus(403);
		res.send("Hahahaha, nope");
		return;
	}

	//req.body.data should be base64 & encrypted with our public key
	//req.body.sig should be a signiture of the data using the server's private key (bukkit)
	//First, base64 decode.
	//Encrypted data MUST be signed by the server with their Private key.. We MUST have their public key to verify

	//Now we can decrypt the message..
	var privateKey = ursa.createPrivateKey(fs.readFileSync("lib/keys/scrimbotPriv.key"));
	var publicKey = ursa.createPublicKey(fs.readFileSync("lib/keys/scrimBotPub.key"));

	req.body.data = req.body.data.replaceAll(" ", "+").trim();

	console.log("Data: " + JSON.stringify(req.body));
	//verifier.update(req.body.data);

	var decrypted = privateKey.decrypt(req.body.data, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING);
	//Our token should be encrypted with OUR public key.. We can decrypt and check against the original token

	var decryptedToken = privateKey.decrypt(req.body.token, 'hex', 'hex', ursa.RSA_PKCS1_PADDING);
	if ( currentTokens[req.body.uniqueId] != decryptedToken ){
		res.sendStatus(402);
		res.end(JSON.stringify({error: true, message: "Sorry, invalid token given"}));
		return;
	}
	//We can now remove the token shiz from the obj
	delete currentTokens[req.body.uniqueId];

	console.log("Decrypted data: " + decrypted.trim());
	if(!decrypted){
		res.sendStatus(400);
		res.end("Fuck off");
		return;
	}


	var body = JSON.parse(decrypted);
	if (body.kills){
		if (!userData.kills)
			userData.kills = body.kills;
		else
			userData.kills += body.kills;
	}

	if(body.deaths){
		if(!userData.deaths)
			userData.deaths = body.deaths;
		else
			userData.deaths += body.deaths;
	}

	if(body.wins){
		if(!userData.wins)
			userData.wins = body.wins;
		else
			userData.wins += body.wins;
	}

	if(body.loses){
		if(!userData.loses)
			userData.loses = body.loses;
		else
			userData.loses += body.loses;
	}

	if(userData.totalPlayed)
		userData.totalPlayed += 1;
	else
		userData.totalPlayed = 1;

	if(!search.delete(McData, "uuid", req.params.id)){
		res.end(JSON.stringify({error: true, message: "Couldn't delete the user to update their record"}));
		return;
	}

	console.log("Deleted user");
	McData.push(userData);
	McData = sort(McData, "uuid");
	res.send(JSON.stringify(userData));
});

module.exports = function(){
	var server = app.listen(config.post_port, function(){
		var host = server.address().address;
		var port = server.address().port;
		console.log("REST API running at http://localhost:%s", port);
	});
};
