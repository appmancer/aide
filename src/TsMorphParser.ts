import { Project, SourceFile, FunctionDeclaration, ClassDeclaration, InterfaceDeclaration } from 'ts-morph';

export interface ParsedFunction {
  name: string;
  isExported: boolean;
}

export interface ParsedClass {
  name: string;
  isExported: boolean;
  methods: string[];
}

export interface ParsedInterface {
  name: string;
  isExported: boolean;
}

export interface ExportedSymbol {
  name: string;
  type: 'function' | 'class' | 'interface' | 'variable';
}

export class TsMorphParser {
  private project: Project;

  constructor() {
    this.project = new Project({
      compilerOptions: {
        target: 99, // ScriptTarget.ESNext
        module: 99, // ModuleKind.ESNext
      },
    });
  }

  getProject(): Project {
    return this.project;
  }

  createSourceFile(fileName: string, sourceCode: string): SourceFile {
    return this.project.createSourceFile(fileName, sourceCode);
  }

  loadFile(filePath: string): SourceFile | undefined {
    try {
      return this.project.addSourceFileAtPath(filePath);
    } catch (error) {
      // Handle file loading errors gracefully
      return undefined;
    }
  }

  getFunctionDeclarations(sourceCode: string): ParsedFunction[] {
    const sourceFile = this.createSourceFile('temp.ts', sourceCode);
    const functions: ParsedFunction[] = [];

    sourceFile.getFunctions().forEach((func: FunctionDeclaration) => {
      const name = func.getName();
      if (name) {
        functions.push({
          name,
          isExported: func.isExported(),
        });
      }
    });

    return functions;
  }

  getClassDeclarations(sourceCode: string): ParsedClass[] {
    const sourceFile = this.createSourceFile('temp.ts', sourceCode);
    const classes: ParsedClass[] = [];

    sourceFile.getClasses().forEach((cls: ClassDeclaration) => {
      const name = cls.getName();
      if (name) {
        const methods = cls.getMethods()
          .map(method => method.getName())
          .filter(name => name !== undefined) as string[];

        classes.push({
          name,
          isExported: cls.isExported(),
          methods,
        });
      }
    });

    return classes;
  }

  getInterfaceDeclarations(sourceCode: string): ParsedInterface[] {
    const sourceFile = this.createSourceFile('temp.ts', sourceCode);
    const interfaces: ParsedInterface[] = [];

    sourceFile.getInterfaces().forEach((iface: InterfaceDeclaration) => {
      const name = iface.getName();
      interfaces.push({
        name,
        isExported: iface.isExported(),
      });
    });

    return interfaces;
  }

  getExportedSymbols(sourceCode: string): ExportedSymbol[] {
    const sourceFile = this.createSourceFile('temp.ts', sourceCode);
    const symbols: ExportedSymbol[] = [];

    // Get exported functions
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      declarations.forEach(declaration => {
        let type: 'function' | 'class' | 'interface' | 'variable' = 'variable';
        
        if (declaration.getKind() === 262) { // SyntaxKind.FunctionDeclaration
          type = 'function';
        } else if (declaration.getKind() === 263) { // SyntaxKind.ClassDeclaration
          type = 'class';
        } else if (declaration.getKind() === 264) { // SyntaxKind.InterfaceDeclaration
          type = 'interface';
        }

        symbols.push({
          name,
          type,
        });
      });
    });

    return symbols;
  }
}