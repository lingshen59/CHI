// src/utils/codeExecutionService.ts
import axios from 'axios';
import { CodeExecutionResult, SupportedLanguage } from '../types/codeExecution';

const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const languageIds: Record<string, number> = {
  'python': 71,
  'javascript': 63,
  'typescript': 74,
  'java': 62,
  'c': 50,
  'cpp': 54,
  'csharp': 51,
  'php': 68,
  'ruby': 72,
  'rust': 73,
  'go': 60,
  'kotlin': 78,
  'swift': 83,
  'r': 80
};

export async function executeCode(language: string, sourceCode: string): Promise<CodeExecutionResult> {
  if (!languageIds[language]) {
    return {
      status: 'error',
      error: `Unsupported language: ${language}`,
      output: null
    };
  }

  try {
    const submission = await axios.post(`${JUDGE0_API_HOST}/submissions`, {
      source_code: sourceCode,
      language_id: languageIds[language],
      stdin: ''
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY
      }
    });

    const token = submission.data.token;
    
    // Wait for execution to complete
    const result = await getSubmissionResult(token);
    
    return {
      status: 'success',
      output: result.stdout || null,
      error: result.stderr || null
    };
  } catch (error) {
    return {
      status: 'error',
      error: 'Execution failed',
      output: null
    };
  }
}

async function getSubmissionResult(token: string) {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await axios.get(`${JUDGE0_API_HOST}/submissions/${token}`, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY
      }
    });

    if (response.data.status.id >= 3) {
      return {
        stdout: response.data.stdout,
        stderr: response.data.stderr
      };
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Execution timeout');
}