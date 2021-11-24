import columnify from "columnify";
import { logger } from "../logger";
const _cloneDeep = require('lodash.clonedeep');

// todo: move to better place, so command and command-registry can use same definition
const columnConfig = {
  minWidth: 10,
  truncateMarker: '...',
  config: {
    description: { maxWidth: 80 },
    options: { maxWidth: 40, minWidth: 15 },
    positionals: { maxWidth: 40, minWidth: 15 }
  },
  preserveNewLines: true,
}

export abstract class Command {

  private _globalOptions: () => string[][] = () => Command.GetGlobalOptions(this.name);

  abstract description: string;
  abstract name: string;
  abstract run(): void;

  positionals: string[][] = [];
  options: string[][] = [];
  constructor(public argv) { }

  private _parsePositionals() {
    this.positionals.forEach((pos, i) => {
      this.argv[pos[0]] = this.argv._[i];
    });
  }

  private _parseOptions() {
    this.options.forEach((optsArr, i) => {
      const opts = optsArr.slice(0, optsArr.length - 1);
      if (opts.length === 2) {

        if (this.argv[opts[0]]) {
          this.argv[opts[1]] = this.argv[opts[0]];
        } else if (this.argv[opts[1]]) {
          this.argv[opts[0]] = this.argv[opts[1]];
        }

      }
    });
  }

  private _getUnsupportedPositionals(): string[] {
    const unsupportedPositionals = [];
    const positionals = this.positionals;
    if (
      (
        this.argv._.length !== positionals.length &&
        this.argv._.indexOf('help') === -1
      ) ||
      positionals.length && !this.argv._.length
    ) {
      this.argv._.forEach((pos) => {
        if (pos !== 'help'){
          unsupportedPositionals.push(pos);
        }
      });
    }
    return unsupportedPositionals;
  }

  private _getUnsupportedOptions(): string[] {
    const unsupportedOptions = [];
    const options = this._globalOptions().concat(this.options || []);
    const argvCopy = _cloneDeep(this.argv);
    delete argvCopy._;
    const argvOptions = Object.keys(argvCopy);
    if (argvOptions.length) {
      for (let i = 0; i < argvOptions.length; i++) {
        const allowedOptions = options.filter((opt) => opt.indexOf(argvOptions[i]) !== -1);
        if (!allowedOptions.length && unsupportedOptions.indexOf(argvOptions[i]) === -1) {
          unsupportedOptions.push(argvOptions[i]);
        }
      }
    }
    return unsupportedOptions;
  }

  isHelp(): boolean {
    return this.argv.help || this.argv.h || ~(this.argv._ || []).indexOf('help');
  }

  printErrors(errors: string[]): void {
    logger.error(
      `${columnify([
        {
          command: this.name,
          ['error(s)']: errors.join('\n')
        }
      ], columnConfig)}\n`
    )
  }

  printHelp(errors = []) {
    if (errors.length) {
      this.printErrors(errors);
    }
    const concattedOptions = this.options.concat(this._globalOptions());
    const positionals = Command.GetOptionsOrPositionalsWithoutDescriptions(this.positionals);
    const options = Command.GetOptionsOrPositionalsWithoutDescriptions(concattedOptions);

    logger.warn(`${this.description}\n\n - ${this.name} <${this.positionals.map((p) => p[0]).join('> <')}> <options>\n`);

    logger.warn(
      `${columnify(positionals.map((pos) => {
        return {
          positionals: pos.opts.join(', '),
          '': pos.description
        }
      }), columnConfig)}\n`
    );

    logger.warn(
      `${columnify(options.map((opt) => {
        return {
          options: opt.opts.join(', '),
          '': opt.description
        }
      }), columnConfig)}\n`
    );

    process.exit();
  }

  runCommand() {

    const unsupportedPositionals = this._getUnsupportedPositionals();
    const errors = [];
    if (unsupportedPositionals.length) {
      errors.push(`Positional(s) [${unsupportedPositionals.join(", ")}] is/are not supported for command '${this.name}'.`);
    }

    const unsupportedOptions = this._getUnsupportedOptions();
    if (unsupportedOptions.length) {
      errors.push(`Option(s) [${unsupportedOptions.join(", ")}] is/are not supported for command '${this.name}'.`);
    }

    if (errors.length) {
      this.printErrors(errors);
      process.exit();
    }

    this._parsePositionals();
    this._parseOptions();
    this.run();

  }

  static GetOptionsOrPositionalsWithoutDescriptions(optionsOrPositionals) {
    return optionsOrPositionals.map((optOrPos: string[]) => {
      return {
        description: optOrPos.pop(),
        opts: optOrPos
      }
    });
  }

  static GetGlobalOptions(commandName: string = '') {
    const contextualHelp = `Shows help for a given command or subcommand`;
    const commandSpectificHelp = `Shows help for the '${commandName}' command.`
    const helpDesc = commandName ? commandSpectificHelp : contextualHelp;
    return [
      [ 'logLevel', 'Sets log level.\n - Default: `info`.\n - Available options: silly, debug, log, info, warn, error' ],
      [ 'h', 'help', helpDesc ] 
    ];
  }

}