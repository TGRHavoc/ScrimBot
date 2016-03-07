var express = require('express'),
	config = require("../../config"),
	bodyParser = require("body-parser"),
	app = express(),
	fs = require('fs'),
	search = require("../algo/binarySearch"),
	sort = require("../algo/mergeSort"),
	ursa = require("ursa");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

app.get("/:discordId", function(req, res){
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
	//req.body.data should be base64 & encrypted with our public key
	//req.body.sig should be a signiture of the data using the server's private key (bukkit)
	//First, base64 decode.
	//Encrypted data MUST be signed by the server with their Private key.. We MUST have their public key to verify

	//Now we can decrypt the message..
	var privateKey = ursa.createPrivateKey(fs.readFileSync("lib/keys/scrimbotPriv.key"));
	var publicKey = ursa.createPublicKey(fs.readFileSync("lib/keys/scrimBotPub.key"));
	var verifier = ursa.createVerifier("sha1WithRSAEncryption");

	req.body.data = req.body.data.replaceAll(" ", "+").trim();
	req.body.sig = req.body.sig.replaceAll(" ", "+").trim();

	console.log("Data: " + JSON.stringify(req.body));
	//verifier.update(req.body.data);

	var decrypted = privateKey.decrypt(req.body.data, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING);

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
