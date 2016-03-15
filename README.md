# ScrimBot

[![Build Status](https://travis-ci.com/TGRHavoc/ScrimBot.svg?token=wyuYpSCuzVuHZspeAGmc&branch=master)](https://travis-ci.com/TGRHavoc/ScrimBot)

ScrimBot is a Bot created for ScrimSpaces' Discord channel to help automate mundane tasks.

# Features
If you want to learn more about specific features including what they do, please refer to the [Features](https://github.com/TGRHavoc/ScrimBot/wiki/Features) page on the Wiki.

* Here should be a list of features for the bot

# Commands
Commands are listed below. And follow the format of `!<base> <command> <args>`. E.g. `!team create TeamName`.

To see all commands, please refer to the [Commands](https://github.com/TGRHavoc/ScrimBot/wiki/Commands) page on the Wiki.

### Base commands
| Base | Desc. |
|:----:|:----:|
| help | Prints commands the user can use and shows what they do |
| team | Base for all team commands |
| ping | Responds with 'pong' |
| myid | Responds with the ID of the user who executed the command |
| pullanddeploy | Bot will perform a git pull master and restart with the new code |
| kys | Logs the bot out of the server and stop it |
| cleanup | Removes all past messages in a channel.. And I mean _**all**_ |
| echo [message] | Will print out given message |
| auth | Base for the auth command |

# Installation

### Requirements
You will need to have [Node.js](https://nodejs.org/en/) installed and
[Node Package Manager](https://docs.npmjs.com/getting-started/installing-node) (npm)

If you want to use the sound features and run the REST API on your environment you will need a couple of extra dependencies. One is any version of [Visual Studio 2015](https://www.visualstudio.com/en-us/products/vs-2015-product-editions.aspx), this allows you to compile the c++ code that comes with some of the node modules used. Another is [OpenSSL](http://slproweb.com/products/Win32OpenSSL.html), this allows the bot to encrypt and decrypt messages sent to/from the Minecraft scrim servers.

### Installing
* Clone the repo from GitHub `git clone https://github.com/TGRHavoc/ScrimBot.git` (use your repo URL if you've forked it). I would recommend using the SSH protocol as the bot uses the git command when running the `pullanddeploy` command (using SSH allows you to run the command without entering your details).
* Install the dependencies `npm install` (in the same directory as the app.js file) alternatively, you can run the `setup_bot.bat` batch file.

### Configuring
Change the values in the JSON files in `/config` and the values within `/config/index.js`

### Running
Before running the bot, make sure you have ran the `setup_bot.bat` batch file then, you can run the `start_bot.bat` batch file. Alternatively you can run the command `node /lib/app.js` with the root directory (the same location as this README).


# Developers
### Contributing
Before you send a pull request, please make sure you have read the following:
* Clone the repo
  * This is pretty self-explanatory first thing you need to do is fork the repo.
* Create a new branch for developing (try to keep the commits to a minimum)
  * Create a new branch that you will keep up-to-date with your progress
  * I'd suggest only committing to this branch when you have a feature fully working and is tested
* Create a pull request
  * Send a pull request to the main repo (https://github.com/TGRHavoc/ScrimBot) from the branch you created
  * Make sure the pull request clearly explains what you have done and why it was implemented


*Author: Jordan Dalton (2016)*
