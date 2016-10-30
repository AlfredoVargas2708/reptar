import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import less from 'less';
import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import LessPluginCleanCSS from 'less-plugin-clean-css';
import LessPluginNpmImport from 'less-plugin-npm-import';
import ProcessorBase from '../processor-base';

export default class Less extends ProcessorBase {
  _getFile() {
    // Derive source path from the input source file.
    const sourcePath = path.dirname(this.assetSource);

    const lessPlugins = [];

    // Add built-in plugins.
    lessPlugins.push(
      new LessPluginNpmImport({
        basedir: sourcePath,
      })
    );

    if (this.plugins) {
      if (!_.isUndefined(this.plugins.autoprefixer)) {
        lessPlugins.push(
          new LessPluginAutoPrefix(this.plugins.autoprefixer || {})
        );
      }
      if (!_.isUndefined(this.plugins['clean-css'])) {
        lessPlugins.push(
          new LessPluginCleanCSS(this.plugins['clean-css'] || {})
        );
      }
    }

    const rawAsset = fs.readFileSync(this.assetSource, 'utf8');

    return new Promise((resolve, reject) => {
      less.render(rawAsset, {
        // Specify search paths for @import directives.
        paths: [sourcePath],
        plugins: lessPlugins,
      }, (e, output) => {
        if (e) {
          reject(e);
          return;
        }

        resolve(output.css);
      });
    });
  }

  _getDestination() {
    const destination = this.assetDestination.replace(
      /\.less$/,
      '.css'
    );

    return destination;
  }
}
