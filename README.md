# echobot

A simple self-bot for echoing from one channel to another

Requires Node.js to be installed

## Config File:

### token:

* This is your login token for discord. If you dont know your token or how to get it, google search 'find my discord self-bot token' There are many articles and videos.

### channels:

* 'guild' is the name of the server, not required if id is set
* 'channel' is the name of the channel to echo messages from. Not required if id is set
* 'color' is used for the embed, its not required and defaults to blue, must be hexadecimal format (i.e. 0x0f0f0f)
* 'id' is not required if both channel and guild are set. It is set automatically on the first message from channels that match 'guild' and 'channel' This reduces chances of losing the feed if the guild or channel name is changed. If you set Channel ID, Guild Name and Channel name will be ignored.


### destChannel:

* This can be set here manually or by typing '.here' into the channel you wish to use as the destination channel 

## Getting started:

Open a command prompt, powershell, or terminal window in the application directory and start the bot with the following command:

```
$ node discobot.js
```

## Chat Commands

**.p** - checks if the bot is running

**.here** - sets destination channel to the channel that it's sent in

**.eb exit** - ends the process

**.eb reload** - reloads the config file without having to restart the bot

**.eb addChannel** - add a channel

* **-id** - ID of channel to add
* **-gc** - guild name and channel name seperated by two forward slashes (//)
* **-c** - color of the embed for this channel in hexadecimal format (i.e. 0x0f0f0f)

**Example:**

```
.eb addChannel -id [your channel id]
```

OR

```
.eb addChannel -gc [guild name]//[channel-name] -c 0x0f0f0f
```

## Recent Changes (0.3)

* images now carry over and dont crash the bot
* timestamped and cleaner console logs (in UTC format)
* chat commands now have error checking to prevent bad config file
* reload config command added

## TODO:

* remove channel with chat commands.
* allow anyone to check process in destination channel
* list commands with a help command

## From The Author

Feedback welcome! I am self taught and not very confident. If you know how to do the things I do better, let me know!