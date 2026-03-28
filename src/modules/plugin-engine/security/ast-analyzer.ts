import { parse } from 'acorn';
import * as walk from 'acorn-walk';

// Fase 1: Task 05 - AST Code Analyzer
// Blokir fungsi berbahaya yang bisa mengakses sistem meskipun dalam worker_threads
const BANNED_IDENTIFIERS = [
  'eval',
  'Function',
  'setTimeout',
  'setInterval',
  'fetch',
  'XMLHttpRequest',
  'fs',
  'child_process',
  'process', // process.env, etc.
  'require',
];

export const analyzePluginCode = (code: string): boolean => {
  try {
    const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    
    let isSafe = true;
    let violation = '';

    walk.simple(ast, {
      Identifier(node: any) {
        if (BANNED_IDENTIFIERS.includes(node.name)) {
          isSafe = false;
          violation = node.name;
        }
      },
      CallExpression(node: any) {
        if (node.callee.name === 'eval') {
          isSafe = false;
          violation = 'eval';
        }
      }
    });

    if (!isSafe) {
      throw new Error(`Kode berbahaya terdeteksi: Penggunaan '${violation}' dilarang di Omni-Tool Plugins.`);
    }

    return true;
  } catch (error: any) {
    throw new Error(`AST Analysis gagal: ${error.message}`);
  }
};
