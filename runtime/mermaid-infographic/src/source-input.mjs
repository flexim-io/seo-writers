import { readFile } from "node:fs/promises";

import { resolveContainedPath } from "./paths.mjs";

const MAX_SOURCE_BYTES = 1_048_576;

async function readBoundedStream(stream) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_SOURCE_BYTES) {
      const error = new Error(`BRIEF_INCOMPLETE: Mermaid source exceeds ${MAX_SOURCE_BYTES} bytes.`);
      error.code = "BRIEF_INCOMPLETE";
      throw error;
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function readSourceInput({ workspaceRoot, sourceOption, stdin = process.stdin }) {
  if (sourceOption === "-") {
    const sourceDocument = await readBoundedStream(stdin);
    if (!sourceDocument.trim()) {
      const error = new Error("BRIEF_INCOMPLETE: Mermaid source on stdin is empty.");
      error.code = "BRIEF_INCOMPLETE";
      throw error;
    }
    return { sourcePath: null, sourceDocument };
  }

  const sourcePath = await resolveContainedPath(workspaceRoot, sourceOption);
  return { sourcePath, sourceDocument: await readFile(sourcePath, "utf8") };
}
