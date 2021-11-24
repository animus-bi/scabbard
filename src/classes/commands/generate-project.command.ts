import columnify from "columnify";
import { logger } from "../../logger";
import { Command } from '../command';
import { GenerateProjectRecipe } from '../recipes';

export class GenerateProjectCommand extends Command {
  name = 'generate';
  description = 'Generates a project in the specified directory...';
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
    
    const projGen = new GenerateProjectRecipe(this);
    projGen.bake();
    
  };

}