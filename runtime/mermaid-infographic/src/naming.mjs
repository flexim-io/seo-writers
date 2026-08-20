import path from "node:path";

export function buildOutputPaths(outputRoot, metadata, hash) {
  const stem = `${metadata.id}--${metadata.canvas}--${hash}`;
  const directory = path.join(outputRoot, metadata.id);
  return {
    directory,
    source: path.join(directory, `${stem}.mmd`),
    svg: path.join(directory, `${stem}.svg`),
    png: path.join(directory, `${stem}.png`),
    preview: path.join(directory, `${stem}--preview.html`),
    qa: path.join(directory, `${stem}--qa.json`),
    work: path.join(directory, `.work-${stem}`),
  };
}
