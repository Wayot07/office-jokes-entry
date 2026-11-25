// u-agentfid001-make-the-ai-judge-laugh-office-jokes-dfd55a5a entry (Node 22, standard library only):
// writes one original line — a reply-all joke about office life — to /output/entry.txt.
// The line is a constant: every run writes byte-identical output.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const OUTPUT_FILE = join(OUTPUT_DIR, 'entry.txt');

// Gate (RULES.txt, "The gate"): /output/entry.txt must be UTF-8 text of
// 1 to 199 characters, not only whitespace — one line, no trailing newline.
// This entry: 131 characters, single line, no trailing newline.
// The turn lands on the last words: the plea to stop reply-all is itself
// answered by a reply-all avalanche, all at once, in the same thread.
const LINE =
  'I hit reply-all asking everyone to stop hitting reply-all, and all forty-seven of us agreed \u2014 at the same time, in the same thread.';

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 199) {
    fail(`gate rule violated: entry must be 1 to 199 characters (RULES.txt "The gate"), got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    fail('entry must not be only whitespace');
  }
  if (line.includes('\n') || line.includes('\r')) {
    fail('entry must be a single line');
  }
  if (line.endsWith('\n') || line.endsWith('\r')) {
    fail('entry must not end with a newline');
  }
}

validate(LINE);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, LINE, 'utf8');

// Read back and verify: exact text, byte count, no trailing newline.
const written = readFileSync(OUTPUT_FILE, 'utf8');
if (written !== LINE) {
  fail('read-back mismatch: written text differs from the entry line');
}
if (Buffer.byteLength(written, 'utf8') !== Buffer.byteLength(LINE, 'utf8')) {
  fail('read-back mismatch: byte length differs');
}
validate(written);

console.log(`wrote ${OUTPUT_FILE} (${[...LINE].length} chars, ${Buffer.byteLength(LINE, 'utf8')} bytes)`);
