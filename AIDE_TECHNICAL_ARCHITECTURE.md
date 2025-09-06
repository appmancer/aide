# AIDE Technical Architecture Document

## Executive Summary

This document defines the technical architecture for **AIDE** (Agent Integrated Development Environment) - a headless semantic code isolation tool designed for AI agent workflows. Based on comprehensive research into LSP integration, TypeScript AST manipulation, plugin architectures, and code extraction precedents, this architecture prioritizes safety, extensibility, and AI agent usability.

## System Overview

AIDE is a **multi-language code extraction engine** with a **TypeScript/Node.js core** and **language-specific plugins**. It provides AI agents with reliable, semantic-aware code isolation capabilities across multiple programming languages.

### Core Design Principles

1. **Safety First**: All operations use transaction-based file handling with comprehensive rollback
2. **Semantic Awareness**: LSP integration ensures type-safe, dependency-aware extractions  
3. **Language Agnostic**: Plugin architecture supports TypeScript, C#, Java, Python, C, etc.
4. **AI Optimized**: JSON APIs, CLI tooling, and headless operation for agent workflows
5. **Production Ready**: Comprehensive validation, error handling, and audit trails

## Architecture Diagrams

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AIDE CORE ENGINE                         │
│                     (TypeScript/Node.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   CLI Interface │  │   JSON API      │  │  Agent SDK      │ │
│  │   (Human Use)   │  │ (Programmatic)  │  │ (AI Agents)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Project Manager │  │ Safety Manager  │  │ Plugin Manager  │ │
│  │ (File Detection)│  │ (Transactions)  │  │ (Lang Loading)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                   LSP COORDINATION LAYER                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          LSP Process Manager & Communication Hub            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    │                           │                           │
┌───▼────┐               ┌─────▼─────┐               ┌─────▼─────┐
│TypeScript│               │    C#     │               │   Java    │
│ Plugin  │               │  Plugin   │               │  Plugin   │
├─────────┤               ├───────────┤               ├───────────┤
│ts-morph │               │ OmniSharp │               │ JDT LSP   │
│TSServer │               │  Roslyn   │               │ Language  │
│Compiler │               │   LSP     │               │  Server   │
│   API   │               │  Server   │               │           │
└─────────┘               └───────────┘               └───────────┘
```

### LSP Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AIDE LSP INTEGRATION                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │               LSP CLIENT COORDINATOR                       │ │
│  │  • Process Management (start/stop LSP servers)             │ │
│  │  • Protocol Translation (JSON-RPC ↔ Plugin Interface)      │ │
│  │  │  • Message Routing (multiplex multiple servers)          │ │
│  │  • Health Monitoring (server status, reconnection)         │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│               SEMANTIC ANALYSIS PIPELINE                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Symbol Resolution│  │ Type Checking   │  │ Dependency      │ │
│  │ • Find Definitions│  │ • Validate Types│  │ Analysis        │ │
│  │ • Reference Search│  │ • Check Compat │  │ • Import Chains │ │
│  │ • Scope Analysis │  │ • Error Detection│  │ • Call Graphs   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
    ┌───▼────┐              ┌───▼────┐              ┌───▼────┐
    │TypeScript│              │   C#    │              │  Java   │
    │LSP Server│              │OmniSharp│              │JDT LSP │
    │(tsserver)│              │LSP      │              │Server  │
    └────────┘              └────────┘              └────────┘
```

### Plugin Architecture Design

```
┌─────────────────────────────────────────────────────────────────┐
│                      PLUGIN ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   PLUGIN INTERFACE                         │ │
│  │                                                             │ │
│  │  interface LanguagePlugin {                                 │ │
│  │    detect(filePath: string): boolean                        │ │
│  │    initialize(config: PluginConfig): Promise<void>          │ │
│  │    extractFunction(request: ExtractionRequest): Promise<T>  │ │
│  │    validateExtraction(result: ExtractionResult): boolean    │ │
│  │    cleanup(): Promise<void>                                 │ │
│  │  }                                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    PLUGIN IMPLEMENTATIONS                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ TypeScript      │  │      C#         │  │     Java        │ │
│  │ Plugin          │  │    Plugin       │  │   Plugin        │ │
│  │ ──────────────  │  │ ──────────────  │  │ ──────────────  │ │
│  │ • ts-morph      │  │ • Roslyn API    │  │ • Eclipse JDT   │ │
│  │ • TypeScript    │  │ • OmniSharp     │  │ • AST Parser    │ │
│  │   Compiler API  │  │ • MSBuild       │  │ • Maven/Gradle  │ │
│  │ • tsserver LSP  │  │ • .NET CLI      │  │ • JDT LSP       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow: Extract/Modify/Replace Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXTRACTION WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   1. PROJECT ANALYSIS │
                    │   • Detect Language   │
                    │   • Load Plugin       │
                    │   • Initialize LSP    │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   2. FUNCTION LOCATION│
                    │   • Parse File        │
                    │   • Find Target       │
                    │   • Validate Selection│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  3. DEPENDENCY ANALYSIS│
                    │   • Resolve Imports   │
                    │   • Track Call Graph  │
                    │   • Identify Types    │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  4. EXTRACTION PREP   │
                    │   • Create Backup     │
                    │   • Start Transaction │
                    │   • Validate Safety   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   5. EXTRACTION       │
                    │   • Generate Code     │
                    │   • Include Context   │
                    │   • Validate Result   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  6. MODIFICATION      │
                    │   • Agent Processing  │
                    │   • External Tool     │
                    │   • Custom Logic      │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   7. REPLACEMENT      │
                    │   • Validate Modified │
                    │   • Apply Changes     │
                    │   • Commit Transaction│
                    └───────────────────────┘
```

## Core Components

### 1. LSP Integration Layer

**Purpose**: Coordinate communication with multiple language servers for semantic analysis.

**Key Features**:
- **Multi-server Management**: Handle TypeScript, C#, Java, Python LSP servers simultaneously
- **Protocol Abstraction**: Unified interface over JSON-RPC variations
- **Health Monitoring**: Automatic reconnection and error recovery
- **Performance Optimization**: Connection pooling and request batching

**Implementation Approach**:
```typescript
class LSPCoordinator {
  private servers: Map<string, LSPServerManager> = new Map();
  private clients: Map<string, LanguageClient> = new Map();
  
  async initializeLanguage(language: string): Promise<void> {
    const config = this.getServerConfig(language);
    const server = new LSPServerManager(config);
    const client = new LanguageClient(server);
    
    await server.start();
    await client.initialize();
    
    this.servers.set(language, server);
    this.clients.set(language, client);
  }
  
  async getSymbolInformation(
    filePath: string, 
    position: Position
  ): Promise<SymbolInformation> {
    const language = this.detectLanguage(filePath);
    const client = this.clients.get(language);
    return await client.getSymbolInformation(filePath, position);
  }
}
```

### 2. Plugin Management System

**Purpose**: Dynamic loading and lifecycle management of language-specific plugins.

**Key Features**:
- **Dynamic Loading**: Load plugins on-demand based on file detection
- **Interface Enforcement**: Standardized plugin interface for consistency
- **Resource Management**: Proper cleanup and memory management
- **Configuration**: Plugin-specific settings and customization

**Implementation Approach**:
```typescript
interface LanguagePlugin {
  name: string;
  supportedExtensions: string[];
  
  detect(filePath: string): boolean;
  initialize(config: PluginConfig): Promise<void>;
  extractFunction(request: ExtractionRequest): Promise<ExtractionResult>;
  validateExtraction(result: ExtractionResult): ValidationResult;
  cleanup(): Promise<void>;
}

class PluginManager {
  private plugins: Map<string, LanguagePlugin> = new Map();
  private loadedPlugins: Set<string> = new Set();
  
  async loadPlugin(language: string): Promise<LanguagePlugin> {
    if (this.loadedPlugins.has(language)) {
      return this.plugins.get(language)!;
    }
    
    const pluginModule = await import(`./plugins/${language}`);
    const plugin = new pluginModule.default();
    
    await plugin.initialize(this.getConfig(language));
    this.plugins.set(language, plugin);
    this.loadedPlugins.add(language);
    
    return plugin;
  }
}
```

### 3. Safety & Transaction Management

**Purpose**: Ensure all file operations are atomic, reversible, and safe.

**Key Features**:
- **Transaction System**: All changes wrapped in reversible transactions
- **Backup Strategy**: Automatic backup before any modification
- **Validation Pipeline**: Multi-layer validation (syntax, semantics, behavior)
- **Rollback Capability**: One-command restoration of previous state

**Implementation Approach**:
```typescript
class SafetyManager {
  private transactions: Map<string, Transaction> = new Map();
  
  async startTransaction(sessionId: string): Promise<Transaction> {
    const transaction = new Transaction(sessionId);
    this.transactions.set(sessionId, transaction);
    return transaction;
  }
  
  async validateOperation(
    operation: FileOperation
  ): Promise<ValidationResult> {
    const results = await Promise.all([
      this.validateSyntax(operation),
      this.validateSemantics(operation),
      this.validateDependencies(operation)
    ]);
    
    return this.combineValidationResults(results);
  }
}

class Transaction {
  private backups: Map<string, string> = new Map();
  private operations: FileOperation[] = [];
  
  async backupFile(filePath: string): Promise<void> {
    if (!this.backups.has(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      this.backups.set(filePath, content);
    }
  }
  
  async rollback(): Promise<void> {
    for (const [filePath, content] of this.backups) {
      await this.atomicWrite(filePath, content);
    }
    this.backups.clear();
  }
}
```

### 4. Code Extraction Engine

**Purpose**: Core extraction logic with semantic awareness and dependency resolution.

**Key Features**:
- **Function Boundary Detection**: Precise identification of extractable code blocks
- **Dependency Resolution**: Automatic inclusion of required imports and types
- **Context Preservation**: Maintain necessary surrounding context
- **Minimal Extraction**: Include only essential dependencies

**Implementation Approach**:
```typescript
class ExtractionEngine {
  constructor(
    private lspCoordinator: LSPCoordinator,
    private pluginManager: PluginManager,
    private safetyManager: SafetyManager
  ) {}
  
  async extractFunction(
    filePath: string,
    functionSelector: FunctionSelector
  ): Promise<ExtractionResult> {
    const language = this.detectLanguage(filePath);
    const plugin = await this.pluginManager.loadPlugin(language);
    const transaction = await this.safetyManager.startTransaction();
    
    try {
      // 1. Validate selection
      const selection = await plugin.validateSelection(
        filePath, 
        functionSelector
      );
      
      // 2. Analyze dependencies
      const dependencies = await this.analyzeDependencies(
        filePath, 
        selection
      );
      
      // 3. Generate extraction
      const extraction = await plugin.extractFunction({
        filePath,
        selection,
        dependencies,
        includeTypes: true,
        includeImports: true
      });
      
      // 4. Validate result
      const validation = await this.safetyManager.validateOperation(extraction);
      if (!validation.valid) {
        throw new Error(`Extraction validation failed: ${validation.errors}`);
      }
      
      await transaction.commit();
      return extraction;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

## Technology Stack Decisions

### Core Technologies

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Core Engine** | TypeScript/Node.js | LSP ecosystem, plugin loading, JSON APIs |
| **LSP Communication** | vscode-jsonrpc | Mature, battle-tested LSP client library |
| **TypeScript Plugin** | ts-morph + Compiler API | Direct TypeScript AST access, semantic analysis |
| **File Operations** | fs-extra + atomic-file | Safe file handling with atomic operations |
| **Process Management** | child_process + tree-kill | LSP server lifecycle management |
| **Configuration** | cosmiconfig | Flexible project-specific configuration |

### Language-Specific Plugins

| Language | LSP Server | AST Library | Package Manager |
|----------|------------|-------------|-----------------|
| **TypeScript** | tsserver | ts-morph | npm/yarn |
| **C#** | OmniSharp | Roslyn API | NuGet |
| **Java** | Eclipse JDT | Eclipse AST | Maven/Gradle |
| **Python** | Pylsp/Pyright | ast module | pip |
| **C/C++** | clangd | libclang | cmake/pkg-config |

### Supporting Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **CLI Framework** | commander.js | User interface and scripting |
| **API Framework** | fastify | JSON API for programmatic access |
| **Logging** | winston | Comprehensive audit trails |
| **Testing** | jest + ts-jest | Unit and integration testing |
| **Validation** | ajv | JSON schema validation |
| **Documentation** | typedoc | API documentation generation |

## Interface Definitions

### Core Interfaces

```typescript
// Extraction Request Interface
interface ExtractionRequest {
  filePath: string;
  selector: FunctionSelector;
  options: ExtractionOptions;
}

interface FunctionSelector {
  type: 'name' | 'position' | 'signature';
  value: string | Position | FunctionSignature;
}

interface ExtractionOptions {
  includeTypes: boolean;
  includeImports: boolean;
  includeDependencies: boolean;
  minimalContext: boolean;
  preserveComments: boolean;
}

// Extraction Result Interface
interface ExtractionResult {
  success: boolean;
  extractedCode: string;
  modifiedFile: string;
  dependencies: Dependency[];
  metadata: ExtractionMetadata;
  validation: ValidationResult;
}

interface Dependency {
  type: 'import' | 'type' | 'constant' | 'function';
  name: string;
  source: string;
  required: boolean;
}

// Plugin Interface
interface LanguagePlugin {
  name: string;
  version: string;
  supportedExtensions: string[];
  
  detect(filePath: string): boolean;
  initialize(config: PluginConfig): Promise<void>;
  extractFunction(request: ExtractionRequest): Promise<ExtractionResult>;
  replaceFunction(request: ReplacementRequest): Promise<ReplacementResult>;
  validateExtraction(result: ExtractionResult): ValidationResult;
  cleanup(): Promise<void>;
}
```

### API Interfaces

```typescript
// REST API Endpoints
interface AideAPI {
  // Project Management
  POST /projects/initialize
  GET  /projects/{id}/status
  
  // Code Extraction
  POST /extract/function
  POST /extract/class
  POST /extract/module
  
  // Code Replacement
  POST /replace/function
  POST /replace/class
  
  // Validation
  POST /validate/extraction
  POST /validate/replacement
  
  // Plugin Management
  GET  /plugins/available
  POST /plugins/{name}/load
  POST /plugins/{name}/unload
}

// CLI Commands
interface AideCLI {
  aide init                    // Initialize project
  aide extract <selector>      // Extract code
  aide replace <file>          // Replace with modified code
  aide validate <operation>    // Validate operation
  aide plugins list           // List available plugins
  aide config show            // Show configuration
}
```

## Security Considerations

### File System Security

1. **Sandboxed Operations**: All file operations constrained to project boundaries
2. **Permission Validation**: Verify read/write permissions before operations
3. **Path Traversal Protection**: Prevent access outside project directory
4. **Backup Encryption**: Sensitive backup files encrypted at rest

### LSP Security

1. **Process Isolation**: LSP servers run in isolated processes
2. **Resource Limits**: Memory and CPU limits for LSP processes
3. **Network Security**: LSP communication over local sockets only
4. **Input Validation**: Sanitize all LSP requests and responses

### Plugin Security

1. **Plugin Validation**: Verify plugin signatures and sources
2. **Resource Limits**: Restrict plugin resource usage
3. **API Boundaries**: Plugins cannot access core system functions
4. **Audit Logging**: Comprehensive logging of plugin operations

## Performance Characteristics

### Expected Performance Metrics

| Operation | Target Time | Acceptable Time | Notes |
|-----------|-------------|-----------------|--------|
| **Function Extraction** | <2 seconds | <5 seconds | Typical TypeScript function |
| **Project Initialization** | <10 seconds | <30 seconds | Medium project (1000 files) |
| **Plugin Loading** | <1 second | <3 seconds | Cold start including LSP |
| **Validation Pipeline** | <1 second | <2 seconds | Multi-layer validation |
| **Memory Usage** | <100MB | <250MB | Base system + 2 plugins |

### Optimization Strategies

1. **LSP Connection Pooling**: Reuse connections across operations
2. **AST Caching**: Cache parsed ASTs for repeated operations
3. **Incremental Analysis**: Only analyze changed code sections
4. **Parallel Processing**: Concurrent validation and dependency analysis
5. **Lazy Loading**: Load plugins and resources on-demand

## Deployment Architecture

### Development Environment

```
Local Machine
├── AIDE Core (Node.js)
├── LSP Servers (per language)
├── Plugin Directory
└── Project Workspace
```

### CI/CD Integration

```
CI Pipeline
├── AIDE CLI Installation
├── Project Analysis
├── Automated Code Extraction
├── Quality Validation
└── Deployment Package
```

### Production Deployment

```
Server Environment
├── AIDE API Service
├── Plugin Registry
├── LSP Server Pool
├── Backup Storage
└── Audit Logging
```

## Conclusion

This technical architecture provides a robust foundation for AIDE's semantic code isolation capabilities. The design prioritizes safety through comprehensive validation and transaction management, while maintaining the flexibility needed for multi-language support through the plugin architecture.

The LSP integration strategy ensures semantic accuracy and consistency with existing development tools, while the TypeScript/Node.js core provides the performance and ecosystem support needed for production deployment.

Key architectural decisions include:

1. **Safety-first design** with transaction-based file operations
2. **Plugin architecture** for language extensibility  
3. **LSP integration** for semantic awareness
4. **JSON APIs** optimized for AI agent consumption
5. **Comprehensive validation** at every stage

This architecture supports AIDE's goal of reducing AI agent syntax errors by 90% and achieving 95% first-pass success rates through reliable, semantic-aware code extraction and replacement workflows.