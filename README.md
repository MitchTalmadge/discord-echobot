# Discord Echobot

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

The purpose of this bot is to allow you to copy messages from one Discord channel to another Discord channel, even if you don't have permission to add a bot account to the guild you are copying from.

This is done by turning your own Discord account into a bot -- copied messages are sent by _you_, not a bot.

**NOTE:** Using this (or any) self-bot is **against Discord's [Terms of Service](https://discordapp.com/terms)** — use at your own risk!

## Requirements

To setup and run this bot, you must first [install Node.js](https://nodejs.org/en/).

## Setup

1. Download the [latest release](https://github.com/MitchTalmadge/discord-echobot/releases/latest) source code.
2. Extract the source code to a folder of your choosing.
3. Create a file called `config.json` in the extracted directory and fill it out. You can see `config.example.json` for an example.
4. Open a command prompt or terminal in the extracted directory, and run `npm install`.

### Options

* `title`: Displayed at the top of each message. Optional.
  * ```"title": "New Copied Message"```

* `richEmbed`: Whether or not to use rich embedding. Looks nicer, but has no support for displaying link metadata automatically (images, page details, etc). Users must click links instead.
  * ```"richEmbed": true```

* `richEmbedColor`: The color for the border of the rich embed if `richEmbed` is `true`. To choose the color, get the hex value (like #0078ff) and then go to google and type "0x0078ff to decimal" -> the number you get is what you want.
  * ```"richEmbedColor": 30975```

* `includeSource`: Whether to include a line at the bottom showing the server and channel that the message came from.
  * ```"includeSource": true```

* `removeEveryone`: Whether to remove all instances of `@everyone` in the messages. This prevents accidental mentioning.
  * ```"removeEveryone": true```

* `removeHere`: Same as `removeEveryone` except for `@here`.
  * ```"removeHere": true```

* `copyRichEmbed`: Sometimes a source message may include a rich embed of its own, with or without a normal, non-embed message. To copy to the rich embed message, this option must be true. The rich embed message will take precedence over the non-embed message. If that made no sense, juse keep this true.
  * ```"copyRichEmbed": true```

## Running

Open a command prompt or terminal in the extracted directory, and run `npm start`.

## Finding your Token

This Discord bot is called a "self-bot," meaning it runs as your personal Discord account rather than a separate bot account.

In order for this to work, you need to provide your Discord token in the `config.json` file. To find this token, follow these steps:

1. Open the Discord client on your computer.
2. Push `Ctrl + Shift + I` to open the dev tools (may be different on non-windows operating systems).
3. Go to the `Application` tab (may be hidden under the `>>` arrows).
4. Click on "Local Storage -> https://discordapp.com".
5. Find the `token` key, usually at the bottom, and copy the value.

The token will now be on your clipboard and can be pasted into the config. Make sure there is only one set of quotation marks.

## Finding Channel IDs

Redirect sources and destinations use Channel IDs, which look like large numbers. To find these, follow these steps:

1. Open the Discord client.
2. Go to User Settings.
3. Go to Appearance.
4. Scroll to the bottom and enable Developer Mode.
5. Close User Settings.
6. Right click on any channel (only text channels are supported, not voice) and select `Copy ID`.

The ID will now be on your clipboard and can be pasted into the config.
