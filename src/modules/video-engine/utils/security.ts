/**
 * Sanitizes metadata for CLI arguments (-metadata key=value).
 * FFmpeg's CLI parser uses the FIRST '=' as a delimiter.
 * Subsequent '=' are treated as part of the value.
 * Newlines must be replaced as they can break CLI argument parsing.
 */
export function sanitizeFFmpegMetadataArg(val: string): string {
  if (!val) return "";
  // Replace newlines and carriage returns with spaces to keep the argument on one line.
  return val.replace(/[\r\n]/g, " ");
}

/**
 * Escapes values for FFMETADATA1 files (used by -i metadata.txt).
 * According to FFmpeg docs, characters '=', ';', '#', '\' and newlines
 * should be escaped with a backslash.
 */
export function escapeFFmetadataValue(val: string): string {
  if (!val) return "";
  return val
    .replace(/\\/g, "\\\\")
    .replace(/=/g, "\\=")
    .replace(/;/g, "\\;")
    .replace(/#/g, "\\#")
    .replace(/\n/g, "\\\n");
}

/**
 * Escapes characters for FFmpeg internal filter parser (e.g., drawtext).
 * Note: Since we are passing arguments as an ARRAY to @ffmpeg/ffmpeg (WASM),
 * we DO NOT need shell-style escaping. We only need FFmpeg-style escaping.
 * Literal "'" must be escaped as "\'"
 * Literal ":" must be escaped as "\:"
 * Literal "\" must be escaped as "\\"
 */
export function escapeFFmpegFilter(val: string): string {
  if (!val) return "";
  return val
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:");
}

/**
 * Sanitizes content for SRT subtitle files.
 * Replaces newlines that could disrupt the SRT structure (rogue index/timestamp).
 * SRT uses blank lines as separators, so double newlines should be collapsed.
 */
export function sanitizeSrtContent(val: string): string {
  if (!val) return "";
  // Ensure we don't have rogue triple newlines which might break some parsers,
  // and keep it to single or double.
  // Also, for basic safety in this context, just replace all newlines with spaces
  // or a controlled newline if the user explicitly wants one.
  // For this "security fix", we'll just replace them with spaces to be absolutely safe
  // from "index injection" unless we implement a full SRT parser.
  return val.replace(/[\r\n]+/g, " ");
}
