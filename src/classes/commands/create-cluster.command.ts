import columnify from "columnify";
import { logger } from "../../logger";
import { Command } from '../command';
import { CreateClusterRecipe } from '../recipes';

type CreateCommandArgv = {
    provider: string,
    group: string,
    user: string,
    profile: string,
    domain: string,
    subdomain?: string,
    region?: string,
}

export class CreateClusterCommand extends Command {
  argv: CreateCommandArgv;
  name = 'createCluster';
  description = 'Deploys K8s to a given cloud provider...';
  positionals = [
    [ 'provider', 'The target cloud provider' ]
  ];
  options = [
    ['g', 'group', 'The aws group name to use for k8s installation'],
    ['u', 'user', 'The aws user name to use for k8s installation'],
    ['p', 'profile', 'The aws profile to use to run aws cli commands'],
    ['d', 'domain', 'The aws route53 domain to create k8s subdomain in'],
    ['s', 'subdomain', 'The aws route53 subdomain'],
    ['r', 'region', 'The aws region to create the cluster in'],
  ];

  run() {
    if (this.isHelp()) {
      this.printHelp();
      process.exit();
    }

    const errors = [];

    if (!this.argv.group) {
      errors.push(`-g, --group is unset`);
    }
    if (!this.argv.user) {
      errors.push(`-u, --user is unset`);
    }
    if (!this.argv.profile) {
      errors.push(`-p, --profile is unset`);
    }
    if (!this.argv.domain) {
      errors.push(`-d, --domain is unset`);
    }
    if (!this.argv.provider) {
      errors.push(`<provider> is unset`);
    }
    if (!this.argv.subdomain) {
      this.argv.subdomain = 'k8s';
    }
    if (!this.argv.region) {
      this.argv.region = 'us-east-1';
    }

    if (errors.length) {
      this.printHelp(errors);
      process.exit();
    }

    
    const projGen = new CreateClusterRecipe(this);
    projGen.bake();
    
  };

}