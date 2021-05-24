import columnify from "columnify";
import { logger } from "../logger";
import { Command } from './command';

export class GenerateCommand extends Command {
  name = 'generate';
  description = 'Generates a serverless project in the specified directory...';
  positionals = [
    [ 'directory', 'The directory to create the project in.\nMust use [-f, --force] to write to non-empty directory.\n' ]
  ];
  options = [
    ['f', 'force', 'Overwrite `directory` contents if directory is not empty']
  ];

  run() {
    if (this.isHelp()) {
      this.printHelp();
      process.exit();
    }
    
    if (this.argv.directory === 'mydir') {
      logger.warn('yeah')
    }

    logger.info('TO DO - write logic to do stuff here')
  };

}