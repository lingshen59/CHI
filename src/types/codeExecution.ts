// src/types/codeExecution.ts
export interface CodeExecutionResult {
  status: 'success' | 'error';
  output: string | null;
  error: string | null;
}

export type SupportedLanguage = 
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'rust'
  | 'go'
  | 'kotlin'
  | 'swift'
  | 'r';

export interface SubmissionResult {
  stdout: string;
  stderr: string;
}