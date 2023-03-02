const execSync = require('child_process').execSync;

execSync('find . -name "node[1-9]*" -type d -ls -exec rm -rv {} + || true', { encoding: 'utf-8' });
execSync(`rm genesis.json || true`, { encoding: 'utf-8' });
execSync(`rm boot.key || true`, { encoding: 'utf-8' });
