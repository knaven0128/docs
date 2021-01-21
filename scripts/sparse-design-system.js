const { execSync } = require('child_process');

const execShellCommand = cmd => {
  console.log(cmd);
  return new Promise((resolve, _) => {
    execSync(cmd, (_, stdout) => resolve(stdout));
  });
};

if (!globalThis.process.env.DOCS_SPARSE_UNDO) {
  // Mark the repo to use sparsecheckout
  execShellCommand('git config core.sparsecheckout true');

  // Build the sparse-checkout file
  const sparseCheckoutFileContent = `
  /*
  !/articles/*/
  /articles/_images
  /articles/ds
  `;
  sparseCheckoutFileContent
    .split('\n')
    .filter(token => token)
    .map(token => token.trim())
    .forEach(token => {
      execShellCommand(`echo '${token}' >> .git/info/sparse-checkout`);
    });

  // Update working directory
  execShellCommand('git read-tree -m -u HEAD');

  // Create the env files for docbuilder TODO: Enable once docbuilder is available
  // const envFileContent = `DOCS_ARTICLES_PATH="articles/ds"`;
  // execShellCommand(`echo '${envFileContent}' > docbuilder/build/.env`);
  // execShellCommand(`echo '${envFileContent}' > docbuilder/develop/.env`);
} else {
  execShellCommand('git sparse-checkout disable');
  execShellCommand('rm -f .git/info/sparse-checkout');
  execShellCommand('git read-tree -m -u HEAD');
}
