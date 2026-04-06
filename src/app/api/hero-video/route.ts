import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { NextRequest } from "next/server";

const HERO_VIDEO_PATH = join(process.cwd(), "public", "kapten-site-assets", "home", "hero-video.mp4");
const VIDEO_CONTENT_TYPE = "video/mp4";
const STREAM_CHUNK_SIZE = 64 * 1024;

function parseRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const [startValue, endValue] = rangeHeader.replace("bytes=", "").split("-");
  const start = startValue ? Number.parseInt(startValue, 10) : 0;
  const end = endValue ? Number.parseInt(endValue, 10) : size - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= size) {
    return null;
  }

  return { end, start };
}

export async function GET(request: NextRequest) {
  const stats = await stat(HERO_VIDEO_PATH);
  const range = parseRange(request.headers.get("range"), stats.size);
  const start = range?.start ?? 0;
  const end = range?.end ?? stats.size - 1;
  const isPartial = Boolean(range);
  const stream = createReadStream(HERO_VIDEO_PATH, {
    end,
    highWaterMark: STREAM_CHUNK_SIZE,
    start,
  });
  const contentLength = end - start + 1;

  return new Response(Readable.toWeb(stream) as ReadableStream<Uint8Array>, {
    headers: {
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Length": contentLength.toString(),
      "Content-Type": VIDEO_CONTENT_TYPE,
      ...(isPartial ? { "Content-Range": `bytes ${start}-${end}/${stats.size}` } : {}),
    },
    status: isPartial ? 206 : 200,
  });
}
