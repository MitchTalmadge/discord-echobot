/*
 * Discord Echobot
 * A Node.js Discord Self-Bot to Copy Messages From One Channel to Another
 *
 * Copyright (C) 2018 Mitch Talmadge (https://github.com/MitchTalmadge)
 * Copyright (C) 2018 bishop-bd (https://github.com/bishop-bd)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Import Node.JS Filesystem Library
import * as fs from 'fs';

// Import winston Logging Library
const winston = require('winston');

// Import Discord.JS Library
import * as discord from 'discord.js';
import {Client, Message, TextChannel} from "discord.js";
import {EchobotConfiguration} from './model/configuration.model';
import * as http from "http";

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

// Keeps track of the last echo executed, to prevent duplicate messages
let lastEcho = null;

// Call the main function.
main();

/**
 * Starts the bot, verifying configuration files as needed.
 */
function main(): void {

    // Load the configuration file.
    if (!loadConfiguration())
        return;

    // Start the web server.
    startWebServer();

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
                if (!redirect.sources || redirect.sources.length == 0) {
                    logger['error']("A redirect has no sources.");
                    return false;
                } else if (!Array.isArray(redirect.sources)) {
                    logger['error']("A redirect's sources were not formatted as an array.");
                    return false;
                }

                // Check destination.
                if (!redirect.destinations || redirect.destinations.length == 0) {
                    logger['error']("A redirect has no destinations.");
                    return false;
                } else if (!Array.isArray(redirect.destinations)) {
                    logger['error']("A redirect's destinations were not formatted as an array.");
                    return false;
                }

                // Check for loop.
                for (let source of redirect.sources) {
                    for (let destination of redirect.destinations) {
                        if (source == destination) {
                            logger['error']("A redirect has a source that is the same as a destination: " + source + ". This will result in an infinite loop.");
                            return false;
                        }
                    }
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
 * Starts the web server that accepts ping messages, if the PORT environment variable is defined.
 *
 * The purpose of this server is to allow the bot to be used on PaaS infrastructures like Heroku,
 * which expect applications to bind to a web port -- as well as allowing for uptime monitoring.
 */
function startWebServer(): void {

    // Ensure PORT env var is defined.
    if (!process.env.PORT || isNaN(Number.parseInt(process.env.PORT)))
        return;

    logger['info']("Starting web server on port " + process.env.PORT);

    // Create a server and bind it to the environment variable PORT.
    http.createServer((req, res) => {
        res.write("pong");
        res.end();
    }).listen(process.env.PORT);
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

    // Register event for when an error occurs.
    discordClient.on('error', error => {
        logger['error']("An error occurred: " + error.message);
        logger['info']("Restarting Discord Client.");
        loginToDiscord();
    });

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

    // Find redirects that have this message's channel id as a source.
    let matchingRedirects = config.redirects.filter(redirect =>
        redirect.sources.some(source => source == message.channel.id)
    );

    // Redirect to each destination.
    matchingRedirects.forEach(redirect => {
        redirect.destinations.forEach(destination => {
            // Find destination channel.
            let destChannel = discordClient.channels.get(destination);
            if (destChannel == null) {
                logger['error']("Could not redirect from channel ID " + message.channel.id + " to channel ID "
                    + destination + ": Destination channel was not found.");
                return;
            } else if (!(destChannel instanceof TextChannel)) {
                logger['error']("Could not redirect from channel ID " + message.channel.id + " to channel ID "
                    + destination + ": Destination channel is not a text channel.");
                return;
            }

            // Relay message.
            logger['info']("Redirecting message by " + message.author.username
                + " from " + message.guild.name + "/" + (message.channel as TextChannel).name
                + " to " + destChannel.guild.name + "/" + destChannel.name
            );

            let messageContents = message.content;

            // Copy rich embed if requested.
            if(redirect.options && redirect.options.copyRichEmbed) {
                message.embeds.forEach(value => {
                   if(value.type == "rich") {
                       messageContents = value.description;
                   }
                });
            }

            // Remove @everyone if requested.
            if (redirect.options && redirect.options.removeEveryone)
                messageContents = messageContents.replace("@everyone", "");

            // Remove @here if requested.
            if (redirect.options && redirect.options.removeHere)
                messageContents = messageContents.replace("@here", "");

            // Determine if we are sending a rich embed or not. (This is decided by if a color is set).
            if (redirect.options && redirect.options.richEmbed) {
                // Sending a rich embed.
                let richEmbed = new discord.RichEmbed({
                    color: redirect.options.richEmbedColor ? redirect.options.richEmbedColor : 30975,
                    description: messageContents
                });

                // Add title if requested.
                if(redirect.options.title) {
                    richEmbed.setTitle(redirect.options.title);
                }

                // Add source if requested.
                if (redirect.options.includeSource) {
                    richEmbed.addField("Source", message.guild.name + "/" + (message.channel as TextChannel).name);
                }

                // Send rich embed message.
                if(lastEcho != richEmbed.description) {
                    (destChannel as TextChannel).send({embed: richEmbed});
                    lastEcho = richEmbed.description;
                }
                return;
            } else {
                // Sending a standard message.
                let destinationMessage = "";

                // Add title if requested.
                if (redirect.options && redirect.options.title) {
                    destinationMessage += "**" + redirect.options.title + "**\n\n";
                }

                // Add copied message.
                destinationMessage += messageContents;

                // Add source if requested.
                if (redirect.options && redirect.options.includeSource) {
                    destinationMessage += "\n\n*Source: " + message.guild.name + "/" + (message.channel as TextChannel).name + "*";
                }

                // Send message.
                if(lastEcho != destinationMessage) {
                    (destChannel as TextChannel).send(destinationMessage);
                    lastEcho = destinationMessage;
                }
                return;
            }
        });
    });
}