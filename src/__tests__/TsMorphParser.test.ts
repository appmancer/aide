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

  describe('AST parsing', () => {
    it('should parse and extract function declarations', () => {
      const parser = new TsMorphParser();
      const testCode = `
        export function testFunction(param: string): number {
          return param.length;
        }
        
        function internalFunction() {
          return "internal";
        }
      `;
      
      const functions = parser.getFunctionDeclarations(testCode);
      
      expect(functions).toHaveLength(2);
      expect(functions[0].name).toBe('testFunction');
      expect(functions[0].isExported).toBe(true);
      expect(functions[1].name).toBe('internalFunction');
      expect(functions[1].isExported).toBe(false);
    });

    it('should parse and extract class declarations', () => {
      const parser = new TsMorphParser();
      const testCode = `
        export class TestClass {
          private value: string;
          
          constructor(value: string) {
            this.value = value;
          }
          
          public getValue(): string {
            return this.value;
          }
        }
      `;
      
      const classes = parser.getClassDeclarations(testCode);
      
      expect(classes).toHaveLength(1);
      expect(classes[0].name).toBe('TestClass');
      expect(classes[0].isExported).toBe(true);
      expect(classes[0].methods).toHaveLength(1);
      expect(classes[0].methods[0]).toBe('getValue');
    });

    it('should parse and extract interface declarations', () => {
      const parser = new TsMorphParser();
      const testCode = `
        interface User {
          id: number;
          name: string;
          email?: string;
        }
        
        export interface ApiResponse<T> {
          data: T;
          status: number;
        }
      `;
      
      const interfaces = parser.getInterfaceDeclarations(testCode);
      
      expect(interfaces).toHaveLength(2);
      expect(interfaces[0].name).toBe('User');
      expect(interfaces[0].isExported).toBe(false);
      expect(interfaces[1].name).toBe('ApiResponse');
      expect(interfaces[1].isExported).toBe(true);
    });
  });

  describe('Symbol analysis', () => {
    it('should extract all exported symbols', () => {
      const parser = new TsMorphParser();
      const testCode = `
        export const constant = 42;
        export function func() {}
        export class Class {}
        export interface Interface {}
        const internal = "private";
      `;
      
      const exports = parser.getExportedSymbols(testCode);
      
      expect(exports).toHaveLength(4);
      expect(exports.map(e => e.name)).toContain('constant');
      expect(exports.map(e => e.name)).toContain('func');
      expect(exports.map(e => e.name)).toContain('Class');
      expect(exports.map(e => e.name)).toContain('Interface');
    });
  });
});