import * as fs from 'fs';
import * as path from 'path';
import { FileTransactionSystem } from '../FileTransactionSystem';

describe('FileTransactionSystem', () => {
  let fileTransactionSystem: FileTransactionSystem;
  let testDir: string;
  let testFile: string;

  beforeEach(() => {
    fileTransactionSystem = new FileTransactionSystem();
    testDir = path.join(__dirname, 'test-files');
    testFile = path.join(testDir, 'test.txt');
    
    // Create test directory and file
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, 'original content');
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('FileTransactionSystem should create backup with timestamp naming', () => {
    // Arrange - test file is set up in beforeEach
    
    // Act - call the backup method that doesn't exist yet
    const backupPath = fileTransactionSystem.createBackup(testFile);
    
    // Assert - verify expected behavior
    expect(fs.existsSync(backupPath)).toBe(true);
    expect(backupPath).toMatch(/\.backup\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/);
    
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    expect(backupContent).toBe('original content');
  });
});