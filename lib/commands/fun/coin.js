var coinCommand = {
	usage: "[times to flip] (defaults to 1)",
	description: "Flip a coin",
	process: function(bot, msg, arguments){
		var args = arguments.split(" ");
		var timesToFlip = 1;
		if (args[0]){
			if (isNaN(args[0])){
				bot.sendMessage({to: msg.channel.id, message: "Sorry, '" + args[0] + "' isn't a number!"});
				return;
			}else{
				timesToFlip = parseInt(args[0]);
			}
		}
		if (timesToFlip > 9000) {
			bot.sendMessage({to: msg.channel.id, message: "Sorry, that number is over 9000!"});
			return;
		}
		var face;
		var tails =0, heads = 0;
		for(var i=0; i<timesToFlip; i++){
			face = Math.floor( Math.random() * (2) );
			if(face == 0)
				tails++;
			else
				heads++;
		}

		if(timesToFlip == 1)
			if (face == 0)
				bot.sendMessage({to: msg.channel.id, message: "**" + msg.user.mention() + "** flipped a coin and got **Heads**"});
			else
				bot.sendMessage({to: msg.channel.id, message: "**" + msg.user.mention() + "** flipped a coin and got **Tails**"});
		else
			bot.sendMessage({to: msg.channel.id, message: "**"+ msg.user.mention() + "** flipped a coin " + timesToFlip +" times.\n\tThey got **"+heads+"** heads and **"+tails+ "** tails!"});
	}
};

module.exports = coinCommand;
