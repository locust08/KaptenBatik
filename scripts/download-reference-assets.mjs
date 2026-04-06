import fs from "node:fs/promises";
import path from "node:path";

const REFERENCE_URL = "https://modestwear-tnc.webflow.io/";
const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "public", "reference-assets");
const IMAGE_DIR = path.join(OUTPUT_ROOT, "images");
const FONT_DIR = path.join(OUTPUT_ROOT, "fonts");
const KNOWN_IMAGE_URLS = [
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/68086e597247de72c53d69bb_fbe082b0c8f8d61f6de9a92166593487_Elegance%20in%20Modesty.avif",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/680b5fc3b63884c0c9fa183c_Search.svg",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6808bb437d7f023db71fa9bd_Bag.svg",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/68071873d1bb97dfbb86e6bd_3148554caddabab88f3dd978c0631004_Rectangle%20724.svg",
];
const KNOWN_FONT_URLS = [
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6800c1c78aeba7b3cc3a5fdd_BeautiqueDisplayCondensed-Light.otf",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6800c2193c00635bcadde5ff_Beautique%20Display%20Condensed-Regular.otf",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6800c22cbb39e7c81127421e_Beautique%20Display%20Condensed-Medium.otf",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6800c2408beb2cfde5256b2e_Beautique%20Display%20Condensed-Bold.otf",
  "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6800c2662dadfaecd2760f40_Beautique%20Display%20Condensed-Black.otf",
];

const ensureDir = async (target) => {
  await fs.mkdir(target, { recursive: true });
};

const slugify = (value) =>
  decodeURIComponent(value)
    .replace(/\s+/g, "-")
    .replace(/[()]+/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

const extractUrls = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const unique = (items) => [...new Set(items.filter(Boolean))];

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
};

const fetchBinary = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
};

const download = async (url, folder) => {
  const fileName = slugify(path.basename(new URL(url).pathname));
  const target = path.join(folder, fileName);
  await fs.writeFile(target, await fetchBinary(url));
  return target;
};

const html = await fetchText(REFERENCE_URL);
const stylesheetUrls = unique(
  extractUrls(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g),
);

const htmlImageUrls = unique([
  ...extractUrls(html, /<(?:img|source)[^>]+(?:src|srcset)=["']([^"'\s,>]+)["']/g),
  ...extractUrls(html, /background-image:\s*url\(&quot;([^&]+)&quot;\)/g),
]);

const cssTexts = await Promise.all(stylesheetUrls.map((url) => fetchText(url)));
const cssAssetUrls = unique(
  cssTexts.flatMap((css) => [
    ...[...css.matchAll(/url\((["']?)(https:[^)]+?\.(?:png|jpe?g|avif|webp|svg))\1\)/g)].map(
      (match) => match[2],
    ),
    ...[...css.matchAll(/url\((["']?)(https:[^)]+?\.(?:woff2?|ttf|otf))\1\)/g)].map(
      (match) => match[2],
    ),
  ]),
);

const imageUrls = unique(
  [...htmlImageUrls, ...cssAssetUrls, ...KNOWN_IMAGE_URLS].filter((url) =>
    /\.(?:png|jpe?g|avif|webp|svg)$/i.test(url),
  ),
);

const fontUrls = unique([
  ...cssAssetUrls.filter((url) => /\.(?:woff2?|ttf|otf)$/i.test(url)),
  ...KNOWN_FONT_URLS,
]);

await Promise.all([ensureDir(IMAGE_DIR), ensureDir(FONT_DIR)]);

const manifest = {
  referenceUrl: REFERENCE_URL,
  downloadedAt: new Date().toISOString(),
  images: [],
  fonts: [],
};

for (const url of imageUrls) {
  const savedTo = await download(url, IMAGE_DIR);
  manifest.images.push({
    url,
    savedTo: path.relative(ROOT, savedTo).replaceAll("\\", "/"),
  });
}

for (const url of fontUrls) {
  const savedTo = await download(url, FONT_DIR);
  manifest.fonts.push({
    url,
    savedTo: path.relative(ROOT, savedTo).replaceAll("\\", "/"),
  });
}

await fs.writeFile(
  path.join(OUTPUT_ROOT, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8",
);

console.log(
  JSON.stringify(
    {
      images: manifest.images.length,
      fonts: manifest.fonts.length,
      manifest: path.relative(ROOT, path.join(OUTPUT_ROOT, "manifest.json")).replaceAll("\\", "/"),
    },
    null,
    2,
  ),
);
