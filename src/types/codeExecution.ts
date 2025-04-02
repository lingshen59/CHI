// src/types/codeExecution.ts
export interface CodeExecutionResult {
    status: 'success' | 'error';
    output: string | null;
    error: string | null;
}

export interface SupportedLanguage {
    [key: string]: number;
}

export interface Judge0SubmissionResponse {
    token: string;
    status: {
        id: number;
        description: string;
    };
    language_id: number;
    source_code: string;
    stdin: string;
    stdout: string;
    stderr: string;
    compile_output: string;
    time: number;
    memory: number;
    created_at: string;
    finished_at: string;
}