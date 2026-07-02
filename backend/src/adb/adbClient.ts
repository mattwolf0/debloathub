import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export async function runAdb(args: string[]) {
  const { stdout, stderr } = await execFileAsync('adb', args, {
    timeout: 5000,
    windowsHide: true,
  })

  return {
    stdout: stdout.toString(),
    stderr: stderr.toString(),
  }
}
