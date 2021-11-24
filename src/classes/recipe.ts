import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logger';
import { Command } from './command';

const _template = require('lodash.template');

export abstract class Recipe<T extends Command> {

  abstract bake(): void;

  constructor(public command: T) { }
  
  ensureTargetDirectoryExists(relativePath: string, failIfNotEmpty = false, failIfExists = false) {
    const fail = (msg) => {
      logger.error(msg);
      process.exit();
    }

    if (!relativePath) {
      return fail(`No directory specified`)
    }

    const absolutePath = path.resolve(relativePath);
    const dirExists = fs.existsSync(absolutePath);

    if (dirExists && failIfExists) {
      return fail(`Directory ${relativePath} exists.`);
    }

    if (dirExists && failIfNotEmpty) {
      return fail(`Directory ${relativePath} exists and is not empty.`);
    }

    if (!dirExists) {
      logger.info(`Directory ${relativePath} does not exist. Creating it.`);
      fs.mkdirSync(absolutePath, { recursive: true });
    } 

    logger.info(`Directory ${relativePath} already exists. Doing nothing.`);

    return true;

  }

  interpolateFile(context, inFile, outFile = '') {
    if (!fs.existsSync(inFile)) {
      this.command.printErrors([`File ${inFile} does not exist`]);
      return process.exit();
    }

    let result;
    try {
      result = _template(
        fs.readFileSync(inFile),
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      )(context);
    } catch(err) {
      this.command.printErrors([`Error interpolating template ${inFile}`, err]);
      return process.exit();
    }

    if (outFile) {
      fs.writeFileSync(outFile, result);
    }

    return result;

  }

  makeFileBashExecutable(filePath) {
    return fs.chmodSync(filePath, '755');
  }

}