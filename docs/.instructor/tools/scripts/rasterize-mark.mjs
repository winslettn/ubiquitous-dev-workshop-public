import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer";

const here = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(here, "..", "src", "default-template", "github-mark.svg");
const outPath = path.resolve(here, "..", "src", "default-template", "github-mark.png");

const svg = fs.readFileSync(svgPath, "utf8");
const size = 512;

const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent}
    #wrap{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center}
    #wrap svg{width:${size}px;height:${size}px}
  </style></head><body><div id="wrap">${svg}</div></body></html>`;
  await page.setContent(html, { waitUntil: "networkidle0" });
  const el = await page.$("#wrap");
  await el.screenshot({ path: outPath, omitBackground: true });
} finally {
  await browser.close();
}

console.log("wrote", outPath, fs.statSync(outPath).size, "bytes");
