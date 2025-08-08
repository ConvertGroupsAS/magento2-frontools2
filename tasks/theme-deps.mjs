import mergeStream from 'merge-stream'
import path from 'path'
import fs from 'fs-extra'
import { env, themes, tempPath, projectPath, browserSyncInstances } from '../helpers/config.mjs'
import {exec} from 'child_process'

export default async function() {
  const streams = mergeStream()
  const installPromises = [];
  Object.keys(themes).forEach(name => {
    console.log(`Compiling styles for theme: ${name}`)
    console.log(themes[name].src)

    const themeDir = path.resolve(projectPath, themes[name].src);

    const packageJsonPath = path.join(themeDir, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      console.log(`Found package.json for ${name}, running npm install...`);

      installPromises.push(new Promise((resolve, reject) => {
        exec('npm install', { cwd: themeDir }, (err, stdout, stderr) => {
          if (stdout) console.log(`[${name}] ${stdout}`);
          if (stderr) console.error(`[${name}] ${stderr}`);
          if (err) {
            console.error(`[${name}] npm install failed`);
            reject(err);
          } else {
            resolve();
          }
        });
      }));
    } else {
      console.log(`No package.json found for ${name}, skipping.`);
    }
  })
  Promise.all(installPromises)
    .then(() => {
      console.log('All theme dependencies installed successfully');
    })
    .catch();
  return streams
}