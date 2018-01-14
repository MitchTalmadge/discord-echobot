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


		if(message.channel.type == "text" && !message.content.startsWith('.eb ')){
			for (var i = 0; i < config.channels.length; i++) {
				if(message.channel.id == config.channels[i].id || (message.guild.name == config.channels[i].guild && message.channel.name == config.channels[i].channel)){
					if(!config.channels[i].hasOwnProperty('id')){
						config.channels[i].id = message.channel.id;

						fs.writeFile("config.json", JSON.stringify(config), function(err) {
							if(err) {
								return console.log(err);
							}
							console.log(" - Config file saved successfully. [Source channel ID added.]");
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
								description: message.content.replace('@everyone ', '').replace('@deleted-role','').replace('@',''),
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
		else if(message.channel.type == "text" && message.content.startsWith('.eb ') && message.author.id == bot.user.id){
			var splitMsg = message.content.split(' ');
			var params = splitMsg
							.join(' ')
							.replace('.eb addChannel ','')
							.split(' ');
			
			//message.channel.send(splitMsg[1]);

			switch(splitMsg[1]){
				case 'addChannel':
				var newConfigChannel = {};

					for (var i=0; i < params.length; i++){
						//message.channel.send(params[i]);
						if(params[i] == '-id'){
							newConfigChannel.id = params[i+1];
						}
						else if(params[i] == '-gc'){
							var gcContents = splitMsg
												.join(' ')
												.replace('-gc ','')
												.replace('.eb addChannel ','')
												.split('//');

							newConfigChannel.guild = gcContents[0];
							newConfigChannel.channel = gcContents[1].split(' ')[0];
						}

						if(params[i] == '-c'){
							newConfigChannel.color = params[i+1];
						}
					}

				break;

				case 'exit':
					process.exit();
				break;
			}

			console.log(JSON.stringify(newConfigChannel) + ' - Config channel added');
			config.channels.push(newConfigChannel);
			fs.writeFile("config.json", JSON.stringify(config), function(err) {
				if(err) {
					return console.log(err);
				}
				console.log(" - Config file saved successfully. [Source channel added.]");
			});
		}


	});
	bot.login(config.token);


	bot.on('error', function(e){
		startBot();
		delete this;
	});
}

startBot();