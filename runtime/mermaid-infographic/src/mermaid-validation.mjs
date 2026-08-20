import DOMPurify from "dompurify";
import mermaid from "mermaid";

DOMPurify.sanitize ??= (value) => value;
DOMPurify.addHook ??= () => {};
mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });

export async function validateMermaidSyntax(source) {
  try {
    const grammarSource = source.replace(
      /<\/?(?:div|span|strong|small|b|br)\b[^>]*>/gi,
      "",
    );
    await mermaid.parse(grammarSource, { suppressErrors: false });
    return true;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message.split("\n")[0] : String(cause);
    const error = new Error(`SYNTAX_INVALID: Mermaid syntax parse failed: ${message}`, {
      cause,
    });
    error.code = "SYNTAX_INVALID";
    throw error;
  }
}
