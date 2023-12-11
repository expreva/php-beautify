import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as php from './php-cli/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const phpLibPath = path.resolve(__dirname)
const phpcbfPath = path.join(phpLibPath, 'phpcbf.phar')
const phpcsPath = path.join(phpLibPath, 'phpcs.phar')
const wpcsPath = path.join(phpLibPath, 'wpcs')
const standardPath = path.join(wpcsPath, 'WordPress')

export async function lintPhpFiles(files, props = {}) {
  return await processPhpFiles(files, {
    ...props,
    type: 'lint'
  })
}

export async function formatPhpFiles(files, props = {}) {
  return await processPhpFiles(files, {
    ...props,
    type: 'format'
  })
}

export async function processPhpFiles(files, props = {}) {

  const { type = 'format', optionsList = [] } = props
  const runtime = type === 'format' ? phpcbfPath : phpcsPath // or lint

  const command = optionsList.includes('--help')
    ? `${optionsList.join(' ')}`
    : `-s -q --extensions=php --runtime-set ignore_errors_on_exit 1 --runtime-set ignore_warnings_on_exit 1 --parallel=5 --runtime-set installed_paths ${wpcsPath} --standard=${standardPath}${
        optionsList.length ? ' ' + optionsList.join(' ') : ''
      }` //  ${fileList}

  // console.log(type === 'format' ? 'phpcsf' : 'phpcs', command, ...files)

  /**
   * Patch console.log() to remove message when program terminates with
   * non-zero exit code. phpcs and phpcsf returns error codes when lint/format
   * found warnings, errors, or format fixes applied.
   */
  const origConLog = console.log
  console.log = (...args) => {
    if (
      typeof args[0] !== 'string' ||
      !(
        args[0].includes('WASM ERROR') ||
        args[0].includes('Program terminated with exit') ||
        args[0].includes('Notice: tempnam(): file created')
      )
    ) {
      return origConLog.apply(console, args)
    }
  }

  try {
    await php.run([runtime, ...command.split(' '), ...files])
  } catch (e) {
    // CodeSniffer terminates with error code 1 when format applied
  }

  console.log = origConLog
}
