/**
 * A CLI script that runs PHP CLI via the WebAssembly build.
 */
import { writeFileSync, existsSync, mkdtempSync } from 'fs'
import { rootCertificates } from 'tls'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import {
  LatestSupportedPHPVersion,
  // SupportedPHPVersion,
  SupportedPHPVersionsList,
} from '@php-wasm/universal'

import { NodePHP } from '@php-wasm/node'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function createPhp(options = {}) {

  const { phpVersion = LatestSupportedPHPVersion } = options

  if (!SupportedPHPVersionsList.includes(phpVersion)) {
    throw new Error(`Unsupported PHP version ${phpVersion}`)
  }

  const php = await NodePHP.load(phpVersion, {
    emscriptenOptions: {
      // onAbort?: (message: string) => void;
      // debug?: boolean;
      // ENV?: Record<string, string>;
      // locateFile?: (path: string) => string;
      // noInitialRun?: boolean;
      // dataFileDownloads?: Record<string, number>;
      // print?: (message: string) => void;
      // printErr?: (message: string) => void;
      // quit?: (status: number, toThrow: any) => void;
      // onRuntimeInitialized?: () => void;
      // monitorRunDependencies?: (left: number) => void;
      // onMessage?: (listener: EmscriptenMessageListener) => void;

      // onAbort(message) {
      //   console.log('abort', message)
      // },
      // print(message){
      //   console.log('print', message)
      // },
      // printErr(message){
      //   console.log('err', message)
      // },
      // quit(status, toThrow) {
      //   console.log('quit', status, toThrow)
      // },

      ENV: {
        ...process.env,
        TERM: 'xterm',
      },
    },
  })

  php.useHostFilesystem()

  return php
}

export async function run(args = [], options = {}) {
  // let args = process.argv.slice(2)
  if (!args.length) {
    args = ['--help']
  }

  // Write the ca-bundle.crt file to disk so that PHP can find it.
  const caBundlePath = new URL('ca-bundle.crt', (import.meta || {}).url)
    .pathname
  if (!existsSync(caBundlePath)) {
    writeFileSync(caBundlePath, rootCertificates.join('\n'))
  }
  args.unshift('-d', `openssl.cafile=${caBundlePath}`)

  // @ts-ignore
  const defaultPhpIniPath = path.join(__dirname, 'php.ini') // await import('./php.ini')

  const php = await createPhp(options)

  /**
   * The method setSpawnHandler is undefined - no longer exists?
   */
  // php.setSpawnHandler((command) => {
  //   const phpWasmCommand = `${process.argv[0]} ${process.execArgv.join(' ')} ${
  //     process.argv[1]
  //   }`
  //   // Naively replace the PHP binary with the PHP-WASM command
  //   // @TODO: Don't process the command. Lean on the shell to do it, e.g. through
  //   //        a PATH or an alias.
  //   const updatedCommand = command.replace(
  //     /^(?:\\ |[^ ])*php\d?(\s|$)/,
  //     phpWasmCommand
  //   )

  //   // Create a shell script in a temporary directory
  //   const tempDir = mkdtempSync('php-wasm-')
  //   const tempScriptPath = `${tempDir}/script.sh`
  //   writeFileSync(
  //     tempScriptPath,
  //     `#!/bin/sh
  //   ${updatedCommand} < /dev/stdin
  //   `
  //   )

  //   return spawn('sh', [tempScriptPath], {
  //     shell: true,
  //     stdio: ['pipe', 'pipe', 'pipe'],
  //     timeout: 100,
  //   })
  // })

  const hasMinusCOption = args.some((arg) => arg.startsWith('-c'))
  if (!hasMinusCOption) {
    args.unshift('-c', defaultPhpIniPath)
  }

  await php
    .cli(['php', ...args])
    .catch((result) => {
      // if (result.name === 'ExitStatus') {
      //   process.exit(result.status === undefined ? 1 : result.status)
      // }
      // throw result
    })
    .finally(() => {
      // process.exit(0)
    })
}
