#!/usr/bin/env node

import findUp from 'find-up';
import yargs from 'yargs';
import log from '../lib/log';

import build from './build';
import newFile from './new';
import watch from './watch';
import clean from './clean';
import init from './init';
import serve from './serve';

const commands = {
  build,
  new: newFile,
  watch,
  clean,
  init,
  serve,
};

yargs
  .command('init', 'scaffold a new site')
  .command('new', 'create new content')
  .command('build', 'build your site', commandYargs => (
    commandYargs.option('clean', {
      alias: 'c',
      default: false,
    })
  ))
  .command('clean', 'clean destination folder')
  .command('serve', 'create a simple web server')
  .command('watch', 'create a server that builds your site lazily')
  .option('incremental', {
    description: 'only build files that have changed',
    boolean: true,
    default: true,
  })
  .option('version', {
    alias: 'v',
    description: 'installed version',
    boolean: true,
  })
  .help('help')
  .default('help');

const argv = yargs.argv;

process.stdout.write('reptar\n\n');

if (argv.version) {
  let packageJson;
  try {
    // eslint-disable-next-line
    packageJson = require(findUp.sync('package.json', {
      cwd: __dirname,
    }));
  } catch (e) { /* noop */ }

  process.stdout.write(packageJson.version);
  process.stdout.write('\n');
} else if (argv._.length === 0) {
  yargs.showHelp('log');
  process.exit(0);
} else {
  const command = argv._[0];
  const commandHandler = commands[command];

  if (!commandHandler) {
    log.error(`Unknown command: ${argv._.join(' ')}`);
    process.stdout.write('\n');
    yargs.showHelp();
  } else {
    commandHandler(argv);
  }
}
