import { logger } from "../../logger";
import { CreateClusterCommand } from "../commands/create-cluster.command";
import { Recipe } from "../recipe";
import { config } from '../../config';

const supportedProviderScriptTemplates = {
  aws: config.pantrySubPath('k8s/create/aws/aws-k8s.sh.template')
  // onPrem: config.pantrySubPath('k8s/create/onPrem-k8s.sh.template'),
  // gcp: config.pantrySubPath('k8s/create/gcp-k8s.sh.template'),
  // azure: config.pantrySubPath('k8s/create/azure-k8s.sh.template'),
}

export class CreateClusterRecipe extends Recipe<CreateClusterCommand> {

  bake() {
    logger.info(`Baking ${this.constructor.name} recipe`);
    const errors = [];

    if (!supportedProviderScriptTemplates[this.command.argv.provider]) {
      errors.push([`${this.command.argv.provider} is not a supported provider`])
    }

    if (errors.length) {
      this.command.printHelp(errors);
      process.exit();
    }

    // if (!this.command.argv.groupName)

    const templatePath = supportedProviderScriptTemplates[this.command.argv.provider];
    const outScriptPath = `${config.tmpPath}/script.sh`;
    const context = this.command.argv;
    const interpolatedContents = this.interpolateFile(context, templatePath, outScriptPath);
    const executable = this.makeFileBashExecutable(outScriptPath);


  }
}