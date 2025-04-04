# bo cleaner
discord self bot to scrape servers, recreation of the ro-cleaner bot

## How to Use
1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Clone the repository:
```bash
git clone https://github.com/ChocolateDrink/bo-cleaner
```
3. Go to the src folder
```bash
cd bo-cleaner/src
```
4. Install dependencies
```bash
npm install
```
5. Run the bot
```bash
node main.js
```

## config
### [main config](https://github.com/ChocolateDrink/bo-cleaner/blob/main/config/config.json)
- **logging - debug:** whether to log debug output
- **logging - common:** whether to log common debug output
- **bot - token:** the token of the account the bot will run on
- **bot - prefix:** the message prefix the bot will respond to
- **whitelisted:** the user ids of people that are whitelisted to use the bot (array of strings)

### [ignores](https://github.com/ChocolateDrink/bo-cleaner/blob/main/config/ignore.json)
- **servers:** the server ids the bot will ignore
- **people:** the user ids of people the bot will ignore

> you can use the `ignore` command to add server/people to the lists

## commands
### main commands
- **get-them:** logs everyone in the current server to a file
- **get-all:** logs everyone in every server to a file

### misc commands
- **exit:** shuts down the bot
- **help:** shows all commands and thier descriptions
- **ignore [what: server/guild | user/person] [id: server id? | user id]:** adds `what` to the ignore list