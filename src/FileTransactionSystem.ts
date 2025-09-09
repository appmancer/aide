import * as fs from 'fs';

export class FileTransactionSystem {
  /**
   * Creates a backup of the specified file with timestamp naming
   * @param sourceFilePath Path to the file to backup
   * @returns The backup file path
   */
  createBackup(sourceFilePath: string): string {
    // Generate timestamp-based backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${sourceFilePath}.backup.${timestamp}`;

    // Copy file to backup location
    fs.copyFileSync(sourceFilePath, backupPath);

    return backupPath;
  }
}