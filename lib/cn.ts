type ClassValue = string | false | null | undefined | ClassValue[];

/** Merge class names; supports nested arrays. */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) out.push(cn(...input));
    else out.push(input);
  }
  return out.join(' ');
}
