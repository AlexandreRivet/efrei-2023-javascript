const concurrently = require('concurrently');

const { commands } = concurrently(
  [
    {
      command: 'serve --no-request-logging ./dist'
    },
    {
      command: 'npm run build && decktape --pdf-author=AlexandreRivet --pdf-title=JavaScript reveal http://localhost:3000/index.html ./documents/javascript.pdf'
    }
  ],
);

const [serveCommand, pdfGenerationCommand] = commands;

pdfGenerationCommand.close.subscribe({
  next() {
    serveCommand.kill();
    if (pdfGenerationCommand.error.hasError === false && pdfGenerationCommand.exited === true) {
      // decktape well exited we can consider to exit properly (exitCode 0)
      process.exit(0);
    } else {
      // otherwise exit with exitCode 1
      process.exit(1);
    }
  }
});