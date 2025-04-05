import glob from 'fast-glob'
import { processPhpFiles } from './index.js'

export async function cli() {
  const args = process.argv.slice(2)
  const command = args.shift()
  const optionsList = args.reduce((o, arg, index) => {
    if (arg.startsWith('-')) {
      // o[arg.replace(/^-{1,2}/, '')] = true
      o.push(arg)
      args.splice(index, 1) // Remove from args
    }
    return o
  }, [])

  // Everything other than options are considered file names or glob patterns
  const files = args.length === 0
    ? []
    : await glob(args, {
        exclude: ['**/node_modules/**', '**/vendor/**'],
      })

  if (command === 'lint' || command === 'format') {
    await processPhpFiles(files, {
      type: command,
      optionsList,
    })

    // Exit is necessary to end PHP process
    process.exit()
  } else {
    console.log(`PHP Beautify

Usage: php-beautify [command] [...options]
Available commands:

  lint [...files]       Lint files for code improvement suggestions 
  lint --help           Show options for lint command

  format [...files]     Beautify files with standard code formatting 
  format --help         Show options for format command
`)
  }
}
