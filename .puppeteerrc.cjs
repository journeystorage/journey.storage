// Puppeteer project configuration.
//
// Puppeteer is a dev-only tool here (local screenshots). The production build
// that Hostinger runs never launches a browser, but its `npm install` was
// triggering puppeteer's Chrome download and failing the whole deploy. This
// config disables that download for every install in this repo.
//
// To use the local screenshot workflow, install Chrome once on your machine:
//   npx puppeteer browsers install chrome
module.exports = {
  skipDownload: true,
};
