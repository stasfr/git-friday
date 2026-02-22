export function firstLetterUpperCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function sanitizeFilename(name: string) {
  return name.replace(/[\\/]/g, '_');
}
