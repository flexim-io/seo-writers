#!/usr/bin/env node

import puppeteer from "puppeteer";

const [chromePath, userDataDir] = process.argv.slice(2);
if (!chromePath || !userDataDir) {
  throw new Error("Browser smoke requires a Chrome executable and contained profile path.");
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-background-networking"],
  userDataDir,
});
try {
  const page = await browser.newPage();
  await page.goto("about:blank", { waitUntil: "load", timeout: 15_000 });
  process.stdout.write(`${await browser.version()}\n`);
} finally {
  await browser.close();
}
