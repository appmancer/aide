import { TsMorphParser } from '../TsMorphParser';

describe('TsMorphParser', () => {
  describe('Project initialization', () => {
    it('should create ts-morph Project instance', () => {
      const parser = new TsMorphParser();
      
      expect(parser.getProject()).toBeDefined();
      expect(parser.getProject().constructor.name).toBe('Project');
    });

    it('should configure compiler options', () => {
      const parser = new TsMorphParser();
      const project = parser.getProject();
      
      const compilerOptions = project.getCompilerOptions();
      expect(compilerOptions.target).toBeDefined();
      expect(compilerOptions.module).toBeDefined();
    });
  });

  describe('File loading', () => {
    it('should load TypeScript files from file system', () => {
      const parser = new TsMorphParser();
      
      // Create a simple test file content
      const testCode = 'export const test = "hello";';
      const sourceFile = parser.createSourceFile('test.ts', testCode);
      
      expect(sourceFile).toBeDefined();
      expect(sourceFile.getBaseName()).toBe('test.ts');
      expect(sourceFile.getFullText()).toContain('export const test');
    });

    it('should handle file loading errors gracefully', () => {
      const parser = new TsMorphParser();
      
      expect(() => {
        parser.loadFile('nonexistent.ts');
      }).not.toThrow();
    });
  });
});