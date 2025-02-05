/**
 * A CLI script that runs PHP CLI via the WebAssembly build.
 * 
 * Based on https://github.com/WordPress/wordpress-playground/blob/trunk/packages/php-wasm/cli/src/main.ts
 * 
 * Changes:
 * - Export function run() instead of running it immediately on import
 * - Accept arguments instead of getting it from command line
 * - Let caller do process.exit() instead of automatically exiting when done
 */
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, existsSync, mkdtempSync, rmSync, rmdirSync } from 'fs';
import { rootCertificates } from 'tls';

import {
	LatestSupportedPHPVersion,
	SupportedPHPVersionsList,
} from '@php-wasm/universal';

import { PHP } from '@php-wasm/universal';
import { spawn } from 'child_process';
import { loadNodeRuntime, useHostFilesystem } from '@php-wasm/node';

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function run(args = [], options = {}) {

  // let args = process.argv.slice(2);
  if (!args.length) {
    args = ['--help'];
  }
  
  // Write the ca-bundle.crt file to disk so that PHP can find it.
  const caBundlePath = new URL('ca-bundle.crt', (import.meta || {}).url).pathname;
  if (!existsSync(caBundlePath)) {
    writeFileSync(caBundlePath, rootCertificates.join('\n'));
  }
  args.unshift('-d', `openssl.cafile=${caBundlePath}`);

  // @ts-ignore
	const defaultPhpIniPath = path.join(__dirname, 'php.ini') //  await import('./php.ini');
	const phpVersion = (options.phpVersion || process.env['PHP'] ||
		LatestSupportedPHPVersion) //as SupportedPHPVersion;
	if (!SupportedPHPVersionsList.includes(phpVersion)) {
		throw new Error(`Unsupported PHP version ${phpVersion}`);
	}

	// npm scripts set the TMPDIR env variable
	// PHP accepts a TMPDIR env variable and expects it to
	// be a writable directory within the PHP filesystem.
	// These two clash and prevent PHP from creating temporary
	// files and directories so let's just not pass the npm TMPDIR
	// to PHP.
	// @see https://github.com/npm/npm/issues/4531
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { TMPDIR, ...envVariables } = process.env;
	const php = new PHP(
		await loadNodeRuntime(phpVersion, {
			emscriptenOptions: {
				ENV: {
					...envVariables,
					TERM: 'xterm',
				},
			},
		})
	);

	useHostFilesystem(php);
	php.setSpawnHandler((command) => {
		const phpWasmCommand = `${process.argv[0]} ${process.execArgv.join(
			' '
		)} ${process.argv[1]}`;
		// Naively replace the PHP binary with the PHP-WASM command
		// @TODO: Don't process the command. Lean on the shell to do it, e.g.
		// through a PATH or an alias.
		const updatedCommand = command.replace(
			/^(?:\\ |[^ ])*php\d?(\s|$)/,
			phpWasmCommand + '$1'
		);

		// Create a shell script in a temporary directory
		const tempDir = mkdtempSync('php-wasm-');
		const tempScriptPath = `${tempDir}/script.sh`;
		writeFileSync(
			tempScriptPath,
			`#!/bin/sh
	${updatedCommand} < /dev/stdin
	`
		);

		try {
			return spawn(updatedCommand, [], {
				shell: true,
				stdio: ['pipe', 'pipe', 'pipe'],
				timeout: 5000,
			});
		} finally {
			// Remove the temporary directory
			rmSync(tempScriptPath);
			rmdirSync(tempDir);
		}
	});

	const hasMinusCOption = args.some((arg) => arg.startsWith('-c'));
	if (!hasMinusCOption) {
		args.unshift('-c', defaultPhpIniPath);
	}

	await php
		.cli(['php', ...args])
		.catch((result) => {
			// if (result.name === 'ExitStatus') {
			// 	process.exit(result.status === undefined ? 1 : result.status);
			// }
			// throw result;
		})
		.finally(() => {
			setTimeout(() => {
				// process.exit(0);
				// 100 is an arbitrary number. It's there to give any child processes
				// a chance to pass their output to JS before the main process exits.
			}, 100);
		});
}
