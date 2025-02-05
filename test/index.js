import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import { lintPhpFiles, formatPhpFiles } from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

;(async () => {
  const srcFile = path.join(__dirname, 'example.php')
  const targetFile = path.join(__dirname, 'example-formatted.php')

  await fs.copyFile(srcFile, targetFile)

  console.log('Linting..')
  try {
    await lintPhpFiles([targetFile])
  } catch (e) {
    console.log(e)
  }

  console.log('Formatting..')
  await formatPhpFiles([targetFile])

  // Exit to stop PHP process
  process.exit()
})().catch(console.error)
