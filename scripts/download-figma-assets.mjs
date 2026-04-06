import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const assets = [
  {
    target: "public/figma-assets/shared/style-daily.png",
    url: "https://www.figma.com/api/mcp/asset/75eaeff6-681c-40f3-8557-77cb5c6193cc",
  },
  {
    target: "public/figma-assets/shared/style-festive.png",
    url: "https://www.figma.com/api/mcp/asset/64b95acd-98a0-466d-85dd-171ec0f4addd",
  },
  {
    target: "public/figma-assets/shared/style-special.png",
    url: "https://www.figma.com/api/mcp/asset/b070394b-d611-409c-9fab-558597f51dc0",
  },
  {
    target: "public/figma-assets/shared/cta-texture.png",
    url: "https://www.figma.com/api/mcp/asset/f8873a83-c595-41fe-bded-321c82e3caff",
  },
  {
    target: "public/figma-assets/register/editorial-fashion-photography.png",
    url: "https://www.figma.com/api/mcp/asset/df00af59-6d50-48f8-bf44-28921eb968a9",
  },
  {
    target: "public/figma-assets/login/high-end-batik-fashion-campaign.png",
    url: "https://www.figma.com/api/mcp/asset/de23e063-a39b-4903-92ce-210472bb18f2",
  },
  {
    target: "public/figma-assets/contact/luxury-batik-fabric-detail.png",
    url: "https://www.figma.com/api/mcp/asset/4b0fdce6-6b05-4b3c-a7ad-90f887da1529",
  },
  {
    target: "public/figma-assets/contact/map-view-kuala-lumpur.png",
    url: "https://www.figma.com/api/mcp/asset/cb9854a3-9e6c-42bd-aada-37141bcecac0",
  },
  {
    target: "public/figma-assets/collections/men-outer-left.png",
    url: "https://www.figma.com/api/mcp/asset/96706d06-8674-4dac-b085-b2b6129f41cd",
  },
  {
    target: "public/figma-assets/collections/men-inner-left.png",
    url: "https://www.figma.com/api/mcp/asset/032c51b7-4a82-4507-8ce3-c8ff7bdf7bd0",
  },
  {
    target: "public/figma-assets/collections/men-center.png",
    url: "https://www.figma.com/api/mcp/asset/820367a5-1ef5-45ed-b512-351e8ed348ae",
  },
  {
    target: "public/figma-assets/collections/men-inner-right.png",
    url: "https://www.figma.com/api/mcp/asset/06b21695-7073-4a05-99cc-482aa22b44fd",
  },
  {
    target: "public/figma-assets/collections/men-outer-right.png",
    url: "https://www.figma.com/api/mcp/asset/ff859873-2bbb-45ad-b50c-b546c327c209",
  },
  {
    target: "public/figma-assets/collections/women-outer-left.png",
    url: "https://www.figma.com/api/mcp/asset/60a690e5-e861-49da-bd1a-254d3e0e373f",
  },
  {
    target: "public/figma-assets/collections/women-inner-left.png",
    url: "https://www.figma.com/api/mcp/asset/6a5521fc-9a0d-4a98-ab70-213b2ccaba37",
  },
  {
    target: "public/figma-assets/collections/women-center.png",
    url: "https://www.figma.com/api/mcp/asset/d9b36074-b523-44ba-b4ca-e529bdc8acb0",
  },
  {
    target: "public/figma-assets/collections/women-inner-right.png",
    url: "https://www.figma.com/api/mcp/asset/22839f59-d864-491e-bd9c-cd767bbd69db",
  },
  {
    target: "public/figma-assets/collections/women-outer-right.png",
    url: "https://www.figma.com/api/mcp/asset/7a8f6e91-38f6-407f-9729-d130e025f7dc",
  },
  {
    target: "public/figma-assets/collections/junior-outer-left.png",
    url: "https://www.figma.com/api/mcp/asset/0155ff6c-0155-434c-82b0-d9b351301c34",
  },
  {
    target: "public/figma-assets/collections/junior-inner-left.png",
    url: "https://www.figma.com/api/mcp/asset/1d65ef62-564d-49ea-93eb-55019ce4168c",
  },
  {
    target: "public/figma-assets/collections/junior-center.png",
    url: "https://www.figma.com/api/mcp/asset/da04f048-a28d-43fd-8d9a-4688907e17df",
  },
  {
    target: "public/figma-assets/collections/junior-inner-right.png",
    url: "https://www.figma.com/api/mcp/asset/ad905c64-d134-4e2f-927c-4a0ac81fb672",
  },
  {
    target: "public/figma-assets/collections/junior-outer-right.png",
    url: "https://www.figma.com/api/mcp/asset/978da049-5d0f-44c0-8d28-c26d463c8d97",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/feature.png",
    url: "https://www.figma.com/api/mcp/asset/bb79fc63-2e75-4411-b4fa-d2d2e27475da",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/main.png",
    url: "https://www.figma.com/api/mcp/asset/8428ec74-2da9-4d9a-a042-b9e9d0723471",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/thumb-1.png",
    url: "https://www.figma.com/api/mcp/asset/83d101e4-9295-4061-882e-a22ed8822e02",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/thumb-2.png",
    url: "https://www.figma.com/api/mcp/asset/6fffec1a-c7c3-443e-b70a-fe793f07417d",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/thumb-3.png",
    url: "https://www.figma.com/api/mcp/asset/8b878c65-b250-4e46-a410-46bc738759d7",
  },
  {
    target: "public/figma-assets/junior-products/gamelan-golden-cream/thumb-4.png",
    url: "https://www.figma.com/api/mcp/asset/dcfc09b1-668c-4ed7-a822-3b33a4d10ba1",
  },
  {
    target: "public/figma-assets/junior-products/saxosoul-blue-glow/feature.png",
    url: "https://www.figma.com/api/mcp/asset/b07ead7d-71f1-42a3-8fc6-cceb8444e4d1",
  },
  {
    target: "public/figma-assets/junior-products/saxosoul-blue-glow/main.png",
    url: "https://www.figma.com/api/mcp/asset/83141080-3d9d-4a37-bb1a-cc798d83f57e",
  },
  {
    target: "public/figma-assets/junior-products/saxosoul-blue-glow/thumb-1.png",
    url: "https://www.figma.com/api/mcp/asset/dd7bb455-d511-4fef-a552-155f77f12daf",
  },
  {
    target: "public/figma-assets/junior-products/saxosoul-blue-glow/thumb-2.png",
    url: "https://www.figma.com/api/mcp/asset/b3898ee8-5b4d-415a-b48c-972353c098a8",
  },
  {
    target: "public/figma-assets/junior-products/saxosoul-blue-glow/thumb-3.png",
    url: "https://www.figma.com/api/mcp/asset/34fd6e08-1098-43e2-9c60-286db9d9bb94",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/feature.png",
    url: "https://www.figma.com/api/mcp/asset/1c0a58f1-ce22-4bf2-8719-ad42cd72073a",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/main.png",
    url: "https://www.figma.com/api/mcp/asset/a458b96d-56ab-419f-a13b-e5d90fe497e8",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/thumb-1.png",
    url: "https://www.figma.com/api/mcp/asset/2803ee00-f087-41a6-9015-769e36aa87d1",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/thumb-2.png",
    url: "https://www.figma.com/api/mcp/asset/3d5bb30d-4c72-4927-98ee-1ef91c06ac03",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/thumb-3.png",
    url: "https://www.figma.com/api/mcp/asset/cc54e4c2-117c-4798-b4a5-0a78726c1c4a",
  },
  {
    target: "public/figma-assets/junior-products/ilham-muse-picasso-lily/thumb-4.png",
    url: "https://www.figma.com/api/mcp/asset/766ff383-57e4-48a7-9a74-967a742e494b",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/feature.png",
    url: "https://www.figma.com/api/mcp/asset/2f3b4695-3f68-40a3-9bd5-dd1815942588",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/main.png",
    url: "https://www.figma.com/api/mcp/asset/2db776cd-1026-45cf-aa8d-65b37ed22f24",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/thumb-1.png",
    url: "https://www.figma.com/api/mcp/asset/d3e71bd0-017a-48f6-b55c-c66761177726",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/thumb-2.png",
    url: "https://www.figma.com/api/mcp/asset/2dae11f8-91cf-4e1b-b3de-62eaa074a199",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/thumb-3.png",
    url: "https://www.figma.com/api/mcp/asset/00e10e3c-0615-4f1c-a62d-15204693fa0c",
  },
  {
    target: "public/figma-assets/junior-products/chepor-waterfall-blue-topaz/thumb-4.png",
    url: "https://www.figma.com/api/mcp/asset/13330d53-d471-4da5-9cde-13d566dd7910",
  },
  {
    target: "public/figma-assets/junior-products/capri-mount-kinabalu-windsurfer/feature.png",
    url: "https://www.figma.com/api/mcp/asset/8416165a-ef45-41d0-807c-908d51f9e7d6",
  },
  {
    target: "public/figma-assets/junior-products/capri-mount-kinabalu-windsurfer/main.png",
    url: "https://www.figma.com/api/mcp/asset/915d956e-8795-42a3-9772-52cb2a3ce5f5",
  },
  {
    target: "public/figma-assets/junior-products/capri-mount-kinabalu-windsurfer/thumb-1.png",
    url: "https://www.figma.com/api/mcp/asset/c1b3ae8b-6d2f-48d2-b850-f63c48fd270c",
  },
  {
    target: "public/figma-assets/junior-products/capri-mount-kinabalu-windsurfer/thumb-2.png",
    url: "https://www.figma.com/api/mcp/asset/59e94c49-0ddc-45fd-aff5-2f9c11538eb0",
  },
  {
    target: "public/figma-assets/junior-products/capri-mount-kinabalu-windsurfer/thumb-3.png",
    url: "https://www.figma.com/api/mcp/asset/947f2e01-1031-457c-aed0-4f83fdb6eb6f",
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
  path.join(ROOT, "public", "figma-assets", "manifest.json"),
  JSON.stringify({ downloadedAt: new Date().toISOString(), assets: manifest }, null, 2),
  "utf8",
);

console.log(JSON.stringify({ downloaded: manifest.length }, null, 2));
