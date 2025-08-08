import {deleteAsync} from 'del'

import { projectPath } from '../helpers/config.mjs'

export const clean = () => {
  // Remove all files under pub/static, except .htaccess
  return deleteAsync([
    projectPath + 'pub/static/*',
    '!' + projectPath + 'pub/static/.htaccess'
  ], { force: true })
}
