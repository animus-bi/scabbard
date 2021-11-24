import { GenerateProjectCommand, Command, CommandRegistry } from './classes/commands';
import { logger } from './logger';
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');

// parse argv
var argv = minimist(process.argv.slice(2));

const commandsRoot = path.join(__dirname, 'classes', 'commands');
const files = fs.readdirSync(commandsRoot).filter((x => !~x.indexOf('index.ts')))
const classes = files.map((filename) => {
  const required = require(path.join(commandsRoot, filename))
  const className = Object.keys(required).filter(c => !~c.indexOf('__'))[0];
  const instance = new required[className](argv);
  return instance instanceof Command ? instance : undefined;
}).filter(x => x);

// register all instances of 
const commandRegistry = new CommandRegistry(...classes);

// find the command the user is trying to run
const foundCommand = commandRegistry.get(argv);

// if no args or user is asking for help
if (
  (
    (!argv._ || !argv._.length) ||               // cases: `qstart`
    argv._[0] === 'help' ||                      // cases: `qstart help`
    (!argv._.length && (argv.help || argv.h))    // cases: `qstart --help`, `qstart -h`, `qstart help -h --help`
  ) &&
  !foundCommand                                  // cases: `qstart <unsupportedcommand>`
) {
  logger.debug(argv, 'foundCommand', foundCommand);
  commandRegistry.printHelp();
  process.exit(0);
}

foundCommand.runCommand();
