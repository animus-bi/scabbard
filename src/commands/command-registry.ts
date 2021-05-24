import columnify from "columnify";
import { logger } from "../logger";
import { Command } from "./command";

// todo: move to better place, so command and command-registry can use same definition
const columnConfig = {
  minWidth: 10,
  truncateMarker: '...',
  config: {
    description: { maxWidth: 80 },
    options: { maxWidth: 40, minWidth: 15 },
    subcommands: { maxWidth: 40, minWidth: 15 }
  },
  preserveNewLines: true,
}

export class CommandRegistry {
  private _commands;

  constructor(...commands) {
    this._commands = commands;
  }

  get commands(){ 
    return this._commands;
  }

  printHelp() {
    const commands = this._commands.map((comm) => {
      return {
        command: comm.name,
        '': comm.description,
      }
    });

    const options = Command
      .GetOptionsOrPositionalsWithoutDescriptions(Command.GetGlobalOptions())
        .map((opt) => {
          return {
            [`global options`]: opt.opts.join(', '),
            '': opt.description
          }
        });

    logger.warn(`${columnify(commands, columnConfig)}\n`);

    logger.warn(`${columnify(options, columnConfig)}\n`);
    
  }

  get(argv) {
    const commandName = argv._.shift();
    for (let i = 0; i < this._commands.length; i++ ) {
      if (this._commands[i].name === commandName) {
        return this._commands[i];
      }
    }
  }
}