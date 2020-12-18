# Discord Echobot
[![GitHub license](https://img.shields.io/github/license/MitchTalmadge/discord-echobot)](https://github.com/MitchTalmadge/discord-echobot/blob/master/LICENSE.md)
[![Actions Status](https://github.com/MitchTalmadge/discord-echobot/workflows/CI/badge.svg)](https://github.com/MitchTalmadge/discord-echobot/actions)
[![GitHub issues](https://img.shields.io/github/issues/MitchTalmadge/discord-echobot)](https://github.com/MitchTalmadge/discord-echobot/issues)

The purpose of this bot is to allow you to copy messages from one Discord channel to another Discord channel, even if you don't have permission to add a bot account to the guild you are copying from.

This is done by turning your own Discord account into a bot -- copied messages are sent by _you_, not a real bot.

**DISCLAIMER:** Using this (or any) self-bot is **against Discord's [Terms of Service](https://discordapp.com/terms)** — use at your own risk! You may get your account banned and I am NOT RESPONSIBLE for it. You chose to use this. Your responsibility.

![](https://i.imgur.com/A6Y6pBh.png)

## Deployment
### Manual (Your laptop, a server, etc.)

To setup and run this bot, you must first [install Node.js](https://nodejs.org/en/).

1. Download the [latest release](https://github.com/MitchTalmadge/discord-echobot/releases/latest) source code.
2. Extract the source code to a folder of your choosing.
3. Configure the bot by **either**:
    - Creating a file called `config.json` in the extracted directory and filling it out. You can see `config.example.json` for an example. Scroll down to see what each option means.
    - **OR** Pasting the entire config JSON (what would normally be in your file) into the environment variable `ECHOBOT_CONFIG_JSON`. (You can do both but the config file will always take precedence).
      
4. Open a command prompt or terminal in the extracted directory, and run `npm install`.
5. Run `npm run build`
6. Each time you want to start the bot, run `npm start`.

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MitchTalmadge/discord-echobot/tree/master)

This bot is compatible with Heroku. You can use the button above to deploy it quickly. 

Use the `ECHOBOT_CONFIG_JSON` environment variable to create your config. Simply put everything that would normally be in the config.json file into this variable. Formatting does not matter.

If the `PORT` environment variable is set (which may happen by default), then this bot will start a web server on that port and will reply `pong` to requests at `/ping`. This is useful because you can use a service like [UptimeRobot](https://uptimerobot.com/) to automatically send a request to the `/ping` endpoint to keep your app from sleeping on the Heroku free tier.

## Configuration

All options are ... well.. optional. Defaults are listed for if you don't include them.

* `title`: Displayed at the top of each message.
  * e.g. ```"title": "New Copied Message"```
  * (Default empty)

* `richEmbed`: Whether or not to use rich embedding. Basically it just looks nicer.
  * e.g. ```"richEmbed": true```
  * (Default `false`)

* `richEmbedColor`: The color for the border of the rich embed if `richEmbed` is `true`. To choose the color, get the hex value (like #0078ff) and then go to google and type "0x0078ff to decimal" -> the number you get is what you want.
  * e.g. ```"richEmbedColor": 30975```
  * (Default `30975`)

* `includeSource`: Whether to include a line at the top showing the nickname, guild, and channel of the author who sent the message.
  * e.g. ```"includeSource": true```
  * (Default `false`)

* `removeEveryone`: Whether to remove all instances of `@everyone` in the messages. This prevents accidental mentioning.
  * e.g. ```"removeEveryone": true```
  * (Default `false`)

* `removeHere`: Same as `removeEveryone` except for `@here`.
  * e.g. ```"removeHere": true```
  * (Default `false`)

* `copyRichEmbed`: Sometimes a source message may include a rich embed of its own, with or without a normal, non-embed message. This includes gifs. To copy to the rich embed message as well as the normal message contents, this option must be true. If that made no sense, just keep this true.
  * e.g. ```"copyRichEmbed": true```
  * (Default `false`)

* `copyAttachments`: When true, the attached files of a message (pdf, image (not gifs! see above), etc.) will be copied into the new message.
  * e.g. ```"copyAttachments": true```
  * (Default `false`)

* `minLength`: The minimum number of characters required in a message body for it to be copied. Messages with embeds will always be copied if `copyRichEmbed` is true. Attachments (including pictures) will not be sent if message is too short and has no embeds. Set to `0` to disable.
  * e.g. ```"minLength": 10```
  * (Default `0`)

* `allowList`: An array that contains the allowed author(s)' Discord IDs, from which the messages will be copied. Use this to filter whose messages will be copied from the channels. Set to an empty array to disable. The IDs must be in quotation marks.
  * e.g. ```"allowList": ["37450973459793455", "94730497535793434"]```
  * (Default `[]`)

### Finding your Token

This Discord bot is called a "self-bot," meaning it runs as your personal Discord account rather than a separate bot account.

In order for this to work, you need to provide your Discord token in the `config.json` file. To find this token, follow these steps:

1. Open the Discord client on your computer.
2. Push `Ctrl + Shift + I` to open the dev tools (may be different on non-windows operating systems).
3. Go to the `Network` tab.
4. Go to any channel in any guild.
5. Click through the network requests that appear and search for the header `authorization`. 
    - You can usually ignore image requests.
6. Copy the value of the `authorization` header.
    - It will look something like `mfa.aasdkf--SDsdkfjhsdf_ewrh-msufeusefsbeouhue_W-34FsedFwEsr_SDFsufserF4_slhSDF432f`

The token will now be on your clipboard and can be pasted into the config. Make sure there is only one set of quotation marks.

### Finding Channel IDs

Redirect sources and destinations use Channel IDs, which look like large numbers. To find these, follow these steps:

1. Open the Discord client.
2. Go to User Settings.
3. Go to Appearance.
4. Scroll to the bottom and enable Developer Mode.
5. Close User Settings.
6. Right click on any channel (only text channels are supported, not voice) and select `Copy ID`.

The ID will now be on your clipboard and can be pasted into the config.