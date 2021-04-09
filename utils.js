const crypto = require("crypto");
const puppeteer = require("puppeteer");

function hash(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

async function generatePdf(title, html) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              -webkit-print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          <div>${title}</div>
          ${html}
        </body>
      </html>
  `);
    await page.pdf({ path: 'files/note.pdf', format: 'A4', });
    await browser.close();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  hash,
  generatePdf
}
