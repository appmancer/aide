import { Project, SourceFile } from 'ts-morph';

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
}