import { runAdb } from './adbClient.js'

type AdbStatus = {
  available: boolean
  version?: string
  message?: string
}

export async function getAdbStatus(): Promise<AdbStatus> {
  try {
    const { stdout } = await runAdb(['version'])

    return {
      available: true,
      version: stdout.trim().split('\n')[0],
    }
  } catch (error) {
    const adbError = error as NodeJS.ErrnoException & { killed?: boolean }

    if (adbError.code === 'ENOENT') {
      return {
        available: false,
        message: 'ADB was not found in PATH.',
      }
    }

    if (adbError.killed) {
      return {
        available: false,
        message: 'ADB status check timed out.',
      }
    }

    return {
      available: false,
      message: adbError.message || 'ADB status check failed.',
    }
  }
}
