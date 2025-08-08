import mergeStream from 'merge-stream'
import path from 'path'
import fs from 'fs-extra'
import { env, themes, tempPath, projectPath, browserSyncInstances } from '../helpers/config.mjs'
import {exec} from 'child_process'
import { globbySync } from 'globby'
import log from 'fancy-log'

export const copyJsTask = async function() {
  // Global variables
  const prod = env.prod || false;

  Object.keys(themes).forEach(name => {
    const theme = themes[name];
    const themeDirSrc = path.resolve(projectPath, theme.src);
    theme.locale.forEach(locale => {
      const themeDirDest = path.resolve(projectPath, theme.dest + '/' + locale);
      const srcPaths  = globbySync(themeDirSrc + '/node_modules/**/**/**.js', { nodir: true});

      srcPaths.forEach(srcPath => {
        const destPath = srcPath.replace('/web', '').replace(themeDirSrc, themeDirDest);

        try {
          fs.ensureFileSync(destPath);
          fs.unlinkSync(destPath);
          if (prod) {
            
            fs.copySync(
              srcPath,
              destPath, {
                overwrite: true,
                errorOnExist: false
            }
            )
          } else {
            fs.symlinkSync(
               srcPath, destPath
            )
          }
        }
        catch (error) {
          log(
            colors.yellow('File ' + destPath + ' error:' + error.message)
          )
        }
      });
    });
  });
};
