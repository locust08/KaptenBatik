import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const assets = [
  {
    target: "public/kapten-site-assets/auth/register-women-category.jpg",
    url: "https://www.kaptenbatik.com.my/cdn/shop/files/Top_Categories-02_720x.jpg?v=1740733763",
  },
  {
    target: "public/kapten-site-assets/auth/login-orkes-man.jpg",
    url: "https://www.kaptenbatik.com.my/cdn/shop/files/ORKES_Man_Homepage_jpg_720x.jpg?v=1771558202",
  },
  {
    target: "public/kapten-site-assets/contact/accessories-flatlay.jpg",
    url: "https://www.kaptenbatik.com.my/cdn/shop/files/Top_Categories-04_6ec3ce10-b077-44c5-aa30-8f60c59bd265_720x.jpg?v=1740735318",
  },
  {
    target: "public/kapten-site-assets/contact/boutique-flagship.jpg",
    url: "https://www.kaptenbatik.com.my/cdn/shop/files/DSC00408_1512x.jpg?v=1751274505",
  },
];

const manifest = [];

for (const asset of assets) {
  const outputPath = path.join(ROOT, asset.target);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${asset.url}: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, bytes);

  manifest.push({
    bytes: bytes.length,
    target: asset.target.replaceAll("\\", "/"),
    url: asset.url,
  });
}

await fs.writeFile(
  path.join(ROOT, "public", "kapten-site-assets", "manifest.json"),
  JSON.stringify({ downloadedAt: new Date().toISOString(), assets: manifest }, null, 2),
  "utf8",
);

console.log(JSON.stringify({ downloaded: manifest.length }, null, 2));
