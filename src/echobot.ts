/*
* Discord Echobot
* A Node.js Discord Self-Bot to Copy Messages From One Channel to Another
*
* @author Mitch Talmadge (https://github.com/MitchTalmadge)
* @author bishop-bd (https://github.com/bishop-bd)
**/

// Import Node.JS Filesystem Library
import * as fs from 'fs';

// Import Winston Logging Library
const winston = require('winston');

// Import Discord.JS Library
import * as discord from 'discord.js';
import {Client, Message} from "discord.js";

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} [${info.level.toLocaleUpperCase()}]: ${info.message}`;
        })
    ),
    transports: new winston.transports.Console()
});

// Create global configuration variable.
let config: any = null;

// Create global discord client variable.
let discordClient: Client = null;

// Call the main function.
main();

/**
 * Starts the bot, verifying configuration files as needed.
 */
function main(): void {

    // Load the configuration file.
    if (!loadConfiguration())
        return;

    // Login to the Discord Client.
    loginToDiscord();
}

/**
 * Attempts to locate and load the configuration file.
 * @returns True if configuration loaded successfully, false otherwise.
 */
function loadConfiguration(): boolean {
    if (fs.existsSync("config.json")) {
        // Parse the config as JSON.
        config = JSON.parse(fs.readFileSync("config.json").toString());

        // Ensure the config has a Discord token defined.
        if (!config.token) {
            logger['error']("The Discord Client token is missing from the configuration file.");
            return false;
        }

        logger['info']("Configuration loaded successfully.");
        return true;
    }
    else {
        logger['error']("config.json does not exist! Please create a configuration file.");
        return false;
    }
}

function loginToDiscord(): void {
    // Create client, but don't login yet.
    discordClient = new discord.Client();

    // Register event for when client is ready.
    discordClient.on('ready', () => {
        logger['info']("Signed into Discord.");
    });

    // Register event for when client receives a message.
    discordClient.on('message', onDiscordClientMessageReceived);

    // Login to Discord.
    discordClient
        .login(config.token)
        .catch(err => {
            logger['error']("Could not sign into Discord: " + err);
        });
}

function onDiscordClientMessageReceived(message: Message) {
    //TODO: Finish this method
    logger['info']("Message Received: " + message.content);
}