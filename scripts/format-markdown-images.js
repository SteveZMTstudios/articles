/**
 * format-markdown-images.js
 * CLI entry for the Markdown image formatter.
 *
 * Usage:
 *   node scripts/format-markdown-images.js            # format all source/*.md in place
 *   node scripts/format-markdown-images.js --check    # dry-run; exit 1 if changes needed
 *   node scripts/format-markdown-images.js --root=DIR # use DIR as project root
 *
 * NOTE: guarded by require.main === module, so Hexo's script loader
 * will NOT auto-execute this during `hexo generate`.
 */
'use strict';

const path = require('path');
const { processMarkdownDirectory } = require('./markdown-image-formatter');

/** Parse CLI arguments: --check, --root <path>, --root=<path> */
function parseArgs(argv) {
  const options = {
    check: false,
    rootDir: process.cwd(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--check') {
      options.check = true;
      continue;
    }

    if (value === '--root' && index + 1 < argv.length) {
      options.rootDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value.startsWith('--root=')) {
      options.rootDir = path.resolve(value.slice('--root='.length));
    }
  }

  return options;
}

/**
 * Main entry: scan source/ markdown files, add/replace image dimensions,
 * and report which files changed.
 */
async function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = await processMarkdownDirectory({
    rootDir: options.rootDir,
    write: !options.check,
  });

  if (options.check) {
    if (summary.changedFiles.length > 0) {
      console.log(summary.changedFiles.map(filePath => path.relative(options.rootDir, filePath)).join('\n'));
      process.exitCode = 1;
      return;
    }

    console.log('No markdown image updates required.');
    return;
  }

  if (summary.changedFiles.length > 0) {
    console.log(`Updated ${summary.changedFiles.length} markdown file(s).`);
  } else {
    console.log('No markdown image updates required.');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}