/* Copy-to-clipboard for the FeatureCallout "recreate it" prompt.

   The prompt is a teaching artifact a student pastes into their OWN AI
   coding tool — something they do on a computer, against the deployed
   web build. Nobody copies a build-this prompt from a phone. So this
   uses the browser clipboard (the same guarded pattern as ThemeToggle's
   swatch copy), and simply no-ops anywhere navigator.clipboard isn't
   available (native, or an insecure context). No native library needed.

   Returns whether the copy landed, so the Copy button only flashes
   "Copied ✓" when it actually did. */

import { Platform } from "react-native";

export async function copyText(text: string): Promise<boolean> {
  if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
