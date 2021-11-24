import { logger } from "../../logger";
import { GenerateProjectCommand } from "../commands";
import { Recipe } from "../recipe";

export class GenerateProjectRecipe extends Recipe<GenerateProjectCommand> {

  bake() {
    logger.info(`Baking ${this.constructor.name} recipe`);
    if (!this.command.argv.directory) {
      this.command.printHelp(['You must specify directory']);
    }

    const dirExists = this.ensureTargetDirectoryExists(this.command.argv.directory);

  }
}