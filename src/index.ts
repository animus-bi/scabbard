import { GenerateCommand, Command, CommandRegistry } from './commands';
import { logger } from './logger';
const minimist = require('minimist');

// parse argv
var argv = minimist(process.argv.slice(2));

const commandRegistry = new CommandRegistry(
  new GenerateCommand(argv),
);

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
