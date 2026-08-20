import { access, mkdir, realpath } from "node:fs/promises";
import path from "node:path";

function pathEscape(message) {
  const error = new Error(`PATH_ESCAPE: ${message}`);
  error.code = "PATH_ESCAPE";
  return error;
}

export function isContainedPath(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function assertDisjointPaths(left, right) {
  const resolvedLeft = path.resolve(left);
  const resolvedRight = path.resolve(right);
  if (
    isContainedPath(resolvedLeft, resolvedRight) ||
    isContainedPath(resolvedRight, resolvedLeft)
  ) {
    throw pathEscape("Installed runtime and dependency cache must be disjoint.");
  }
  return true;
}

export async function resolveContainedPath(root, candidate, options = {}) {
  const { writable = false } = options;
  const resolvedRoot = await realpath(path.resolve(root));
  const lexicalCandidate = path.resolve(candidate);
  let resolvedCandidate;
  try {
    resolvedCandidate = await realpath(lexicalCandidate);
  } catch (cause) {
    const error = new Error(`Path does not exist: ${lexicalCandidate}`, { cause });
    error.code = "BRIEF_INCOMPLETE";
    throw error;
  }
  if (!isContainedPath(resolvedRoot, resolvedCandidate)) {
    throw pathEscape("A symlink resolves outside the authorized workspace.");
  }
  await access(resolvedCandidate, writable ? 6 : 4);
  return resolvedCandidate;
}

export async function resolveOutputChild(outputRoot, childPath) {
  const resolvedRoot = await realpath(path.resolve(outputRoot));
  const candidate = path.resolve(resolvedRoot, childPath);
  if (!isContainedPath(resolvedRoot, candidate)) {
    throw pathEscape("An output path leaves the authorized output root.");
  }
  return candidate;
}

export async function ensureContainedDirectory(root, candidate) {
  const lexicalRoot = path.resolve(root);
  const resolvedRoot = await realpath(lexicalRoot);
  const lexicalCandidate = path.resolve(candidate);
  if (!isContainedPath(lexicalRoot, lexicalCandidate) || lexicalCandidate === lexicalRoot) {
    throw pathEscape("The requested directory leaves the authorized output root.");
  }
  const resolvedParent = await realpath(path.dirname(lexicalCandidate));
  if (!isContainedPath(resolvedRoot, resolvedParent)) {
    throw pathEscape("An output-directory parent resolves outside the authorized workspace.");
  }
  try {
    await mkdir(lexicalCandidate);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const resolvedCandidate = await realpath(lexicalCandidate);
  if (!isContainedPath(resolvedRoot, resolvedCandidate)) {
    throw pathEscape("An output directory resolves outside the authorized workspace.");
  }
  await access(resolvedCandidate, 6);
  return resolvedCandidate;
}
