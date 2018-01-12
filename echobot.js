console.log('EchoBot Started.');

const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

//console.log(config);

const Discord = require('discord.js');


function startBot(){
	var bot = new Discord.Client();

	//error check this
	var dest = 0;

	bot.on('ready', function(){
		console.log('I am ready!');
		dest = bot.channels.get(config.destChannel);
	});

	bot.on('message', function(message){
		if(message.content == ".here" && message.author.id == bot.user.id){
			config.destChannel = message.channel.id;

			dest = bot.channels.get(config.destChannel);

			fs.writeFile("config.json", JSON.stringify(config), function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("Config file saved successfully. [Destination channel added or updated]");
			});
		}

		if(message.content == ".p" && message.author.id == bot.user.id){
			message.channel.send('Process running.');
			console.log('Process Check');
		}


		if(message.channel.type == "text"){
			for (var i = 0; i < config.channels.length; i++) {
				if(message.channel.id == config.channels[i].id || (message.guild.name == config.channels[i].guild && message.channel.name == config.channels[i].channel)){
					if(!config.channels[i].hasOwnProperty('id')){
						config.channels[i].id = message.channel.id;

						fs.writeFile("config.json", JSON.stringify(config), function(err) {
							if(err) {
								return console.log(err);
							}
							console.log("Config file saved successfully. [Source channel ID added.]");
						});
					}
					console.log('Call: ' + message.guild.name + ' : ' + message.channel.name);

					if(dest){
						embedColor = 3447003;

						if(typeof config.channels[i].color !== "undefined"){
							embedColor = parseInt(config.channels[i].color);
							console.log(embedColor);
						}

						dest.send({
							embed: {
								color: embedColor,
								title: "Call Made",
								description: message.content.replace('@everyone ', '').replace('@deleted-role',''),
								fields: [
									{
										name: "Source",
										value: message.guild.name + ' : ' + message.channel.name
									}
								]
							}
						});
					}//if dest
				}//if channel
			}//for	
		}


	});
	bot.login(config.token);


	bot.on('error', function(e){
		startBot();
		delete this;
	});
}

startBot();