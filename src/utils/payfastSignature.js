/**
 * ============================================
 * FarmHand PRO
 * PayFast Signature Utility
 * Sprint 40 - Phase 2.1
 * ============================================
 */

const PASSPHRASE = import.meta.env.VITE_PAYFAST_PASSPHRASE || "";

/**
 * URL encode according to PayFast requirements.
 */
function encode(value) {
  return encodeURIComponent(String(value))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (char) =>
      "%" + char.charCodeAt(0).toString(16).toUpperCase()
    );
}

/**
 * Build the PayFast parameter string.
 */
export function buildParameterString(data = {}) {
  const entries = Object.entries(data)
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    )
    .sort(([a], [b]) => a.localeCompare(b));

  let parameterString = entries
    .map(([key, value]) => `${key}=${encode(value)}`)
    .join("&");

  if (PASSPHRASE) {
    parameterString +=
      (parameterString ? "&" : "") +
      `passphrase=${encode(PASSPHRASE)}`;
  }

  return parameterString;
}

/**
 * Generate an MD5 hash.
 *
 * Browser note:
 * Web Crypto doesn't support MD5.
 * This placeholder keeps the application working
 * until we add the server-side payment verification
 * in the next phase.
 */
export async function generateSignature(data = {}) {
  const parameterString = buildParameterString(data);

  console.warn(
    "PayFast signature generation placeholder in use."
  );

  return parameterString;
}

/**
 * Attach signature to payload.
 */
export async function attachSignature(payload = {}) {
  const signature = await generateSignature(payload);

  return {
    ...payload,
    signature,
  };
}

/**
 * Verify payload signature.
 *
 * Placeholder until backend verification is added.
 */
export async function verifySignature(payload = {}) {
  const expected = await generateSignature(payload);

  return expected === payload.signature;
}

export default {
  buildParameterString,
  generateSignature,
  attachSignature,
  verifySignature,
};
