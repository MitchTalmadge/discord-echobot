/*
* Discord Echobot
* A Node.js Discord Self-Bot to Copy Messages From One Channel to Another
*
* @author Mitch Talmadge (https://github.com/MitchTalmadge)
* @author bishop-bd (https://github.com/bishop-bd)
**/

// Import Node.JS Filesystem Library
import * as fs from 'fs';

// Import winston Logging Library
const winston = require('winston');

// Import Discord.JS Library
import * as discord from 'discord.js';
import {Client, Message, TextChannel} from "discord.js";
import {EchobotConfiguration} from './EchobotConfiguration';

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
let config: EchobotConfiguration = null;

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

        // Validate format of redirects
        if (!config.redirects) { // Ensure redirects exist.
            logger['error']("You have not defined any redirects. This bot is useless without them.");
            return false;
        } else if (!Array.isArray(config.redirects)) { // Ensure redirects is an array.
            logger['error']("The redirects are not properly formatted (missing array). Please check your configuration.");
            return false;
        } else if (config.redirects.length == 0) { // Ensure we have at least one redirect.
            logger['error']("You have not defined any redirects. This bot is useless without them.");
            return false;
        } else {

            // Check each redirect.
            for (let redirect of config.redirects) {

                // Check source.
                if (!redirect.source) {
                    logger['error']("A redirect is missing a source.");
                    return false;
                }

                // Check destination.
                if (!redirect.dest) {
                    logger['error']("A redirect is missing a destination.");
                    return false;
                }

                // Check for loop.
                if(redirect.source == redirect.dest) {
                    logger['error']("A redirect's destination is the same as its source. This will result in an infinite loop.");
                    return false;
                }
            }
        }

        // Validation complete.
        logger['info']("Configuration loaded successfully.");
        return true;
    }
    else {
        logger['error']("config.json does not exist! Please create a configuration file.");
        return false;
    }
}

/**
 * Signs into the Discord client with the token in the config,
 * and subscribes to message listeners.
 */
function loginToDiscord(): void {
    // Create client, but don't login yet.
    discordClient = new discord.Client();

    // Register event for when client is ready.
    discordClient.on('ready', () => {
        logger['info']("Signed into Discord.");
    });

    // Register event for when client receives a message.
    discordClient.on('message', onDiscordClientMessageReceived);

    // Login.
    discordClient
        .login(config.token)
        .catch(err => {
            logger['error']("Could not sign into Discord: " + err);
        });
}

/**
 * Fired when a message is received on Discord in any channel.
 * @param message The message that was received.
 */
function onDiscordClientMessageReceived(message: Message): void {

    // Find redirects matching this message's channel
    let matchingRedirects = config.redirects.filter(redirect => redirect.source == message.channel.id);

    // Redirect to each source.
    matchingRedirects.forEach(redirect => {

        // Find destination channel.
        let destChannel = discordClient.channels.get(redirect.dest);
        if (destChannel == null) {
            logger['error']("Could not redirect from channel ID " + redirect.source + " to channel ID " + redirect.dest + ": Destination channel was not found.");
            return;
        } else if (!(destChannel instanceof TextChannel)) {
            logger['error']("Could not redirect from channel ID " + redirect.source + " to channel ID " + redirect.dest + ": Destination channel is not a text channel.");
            return;
        }

        // Relay message.
        logger['info']("Redirecting message by " + message.author.username + " from " + message.guild.name + "/" + (message.channel as TextChannel).name + " to " + destChannel.guild.name + "/" + destChannel.name);
        (destChannel as TextChannel).send(message.content);
    });
}