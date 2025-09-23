import chalk = require('chalk')

const logger = {
    error(msg: string) {
        console.error(`[${chalk.bgBlack("ERROR")}] -  ${msg}`)
    },

    // Commands & Events
    command(commandName: string) {
        console.log(`[${chalk.blue(commandName)}] - Command loaded sucessfuly`)
    },

    event(eventName: string) {
        console.log(`[${chalk.magenta(eventName)}] - Event loaded successfuly`)
    },

    propError(fileName: string, missingProp: string, fileType: "command" | "event") {
        fileName = fileType == "command" ? chalk.blue(fileName) : chalk.magenta(fileName)
        this.error(`${fileType} ${fileName} is missing ${chalk.yellow(missingProp)} property`)
    },

    warn(msg: string) {
        console.log(`[${chalk.bgYellow(chalk.black('WARNING'))}] - ${msg}`)
    },

    status(msg: string) {
        console.log(`[${chalk.bgBlue(chalk.black('STATUS'))}] - ${msg}`)
    }
}


export default logger
