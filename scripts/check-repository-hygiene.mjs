import { execFileSync } from 'node:child_process';

const forbiddenPaths = [/(^|\/)node_modules\//, /(^|\/)\.next\//, /(^|\/)coverage\//, /(^|\/)dist\//, /(^|\/)out\//, /(^|\/)\.env(?:\.|$)/, /\.(?:pem|key|p12|pfx)$/i, /\.(?:db|sqlite|sqlite3)$/i];
const forbiddenNames = new Set(['.DS_Store', 'Thumbs.db']);
const secretLikeNames = [/(^|\/)id_rsa(?:\.pub)?$/i, /(^|\/)id_ed25519(?:\.pub)?$/i, /(^|\/)credentials(?:\.[^/]+)?$/i, /(^|\/)secrets?(?:\.[^/]+)?$/i];
const output = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
const files = output.split('\0').filter(Boolean);
const violations = files.filter((file) => forbiddenNames.has(file.split('/').at(-1)) || forbiddenPaths.some((pattern) => pattern.test(file)));
const suspicious = files.filter((file) => secretLikeNames.some((pattern) => pattern.test(file)));
if (violations.length || suspicious.length) {
  console.error('Repository hygiene check failed.');
  for (const file of [...violations, ...suspicious]) console.error(`- ${file}`);
  process.exit(1);
}
console.log(`Repository hygiene check passed (${files.length} tracked files inspected).`);
