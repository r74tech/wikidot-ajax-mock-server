// src/utils/token.ts
// Use Web Crypto API which is available in both Node.js and Cloudflare Workers

// Function to generate random bytes
function getRandomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
}

// Convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

// Generate a Wikidot token7 (similar to their format)
export function generateWikidotToken(): string {
    return bytesToHex(getRandomBytes(16));
}

// Validate a token (in a mock server this is simple)
export function validateWikidotToken(token: string): boolean {
    // For testing purposes, assume any token with correct length is valid
    return token !== '' && token.length === 32;
}
