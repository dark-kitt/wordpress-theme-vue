/**
 *
 * get node CLI arguments
 * node script/file.js ENV=value
 *
 * NOTE:
 * you can use this arguments to
 * overwrite existing environment variables
 *
 * node script/file.js MODE=production
 * or
 * yarn dev MODE=production
 * --------------------------------
 */
const argv = {};
process.argv.forEach((val, key) => {
  /**
   *
   * NOTE:
   * the first two arguments in
   * the process.argv array are the
   * node path and the file path
   * --------------------------------
   */
  if (key === 0 || key === 1) {
    argv[key === 0 ? 'nodePath' : 'filePath'] = val;
    return true;
  }
  return Object.assign(argv, {
    [val.split('=')[0]]: val.split('=')[1]
  });
});
/**
 *
 * require environment variables
 * --------------------------------
 */
import dotenv from 'dotenv';
const dot = dotenv.config({ path: './configs/.env' });
/** check syntax */
if (dot.error) throw dot.error;
/** extend the interface for particular declarations */
interface Env {
  [key: string]: string | boolean;
  WEBPACK_MODE?: 'development' | 'production';
}
/** merge arguments */
const env: Env = {
  ...dot.parsed,
  ...argv
};
/** string to boolean */
for (let key in env) {
  if (Object.hasOwnProperty.call(env, key)) {
    if (env[key] === 'true') env[key] = true;
    if (env[key] === 'false') env[key] = false;
  }
}

export default env;
