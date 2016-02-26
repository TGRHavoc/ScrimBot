# ScrimBot

ScrimBot is a Bot created for ScrimSpaces' Discord channel to help automate mundane tasks.

# Features
* Here should be a list of features for the bot

# Commands
Commands are listed below. And follow the format of `!<base> <command> <args>`. E.g. `!team create TeamName`

### Base commands
| Base | Desc. |
|:----:|:----:|
| help | Prints commands the user can use and shows what they do |
| team | Base for all team commands |
| ping | Responds with 'pong' |
| myid | Responds with the ID of the user who executed the command |
| whois | Base for whois commands |
| pullanddeploy | Bot will perform a git pull master and restart with the new code |

### Teams
Base: team

| Command | Args | Desc. |
| :---:   |:---: | :---: |
| create [name] | name = Name of team to create | Creates a team with the specified name |




# Installation

### Requirements
You will need to have [Node.js](https://nodejs.org/en/) installed and 
[Node Package Manager](https://docs.npmjs.com/getting-started/installing-node) (npm)

### Installing
* Clone the repo from GitHub `git clone https://github.com/TGRHavoc/ScrimBot.git` (use your repo URL if you've forked it)
* Install the dependencies `npm install` (in the same directory as the app.js file)

### Configuring
Change the values in the JSON files in /config

### Running
Type `node app.js` in the same directory as the app.js file.


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