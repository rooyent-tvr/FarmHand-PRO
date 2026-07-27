import crypto from "crypto";

/**
 * Build a PayFast parameter string.
 */
export function buildParameterString(data = {}) {
  return Object.keys(data)
    .filter(
      (key) =>
        data[key] !== undefined &&
        data[key] !== null &&
        data[key] !== ""
    )
    .sort()
    .map(
      (key) =>
        `${key}=${encodeURIComponent(String(data[key]).trim()).replace(
          /%20/g,
          "+"
        )}`
    )
    .join("&");
}

/**
 * Generate an MD5 signature.
 */
export function generateSignature(data, passphrase = "") {
  let parameterString = buildParameterString(data);

  if (passphrase) {
    parameterString += `&passphrase=${encodeURIComponent(passphrase)}`;
  }

  return crypto
    .createHash("md5")
    .update(parameterString)
    .digest("hex");
}

/**
 * Verify the incoming ITN signature.
 */
export function verifySignature(data, passphrase = "") {
  const receivedSignature = data.signature;

  if (!receivedSignature) {
    return false;
  }

  const payload = { ...data };
  delete payload.signature;

  const generatedSignature = generateSignature(
    payload,
    passphrase
  );

  return (
    receivedSignature.toLowerCase() ===
    generatedSignature.toLowerCase()
  );
}

/**
 * Get the correct PayFast validation URL.
 */
export function getValidationUrl() {
  const sandbox =
    process.env.PAYFAST_SANDBOX === "true";

  return sandbox
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";
}

export default {
  buildParameterString,
  generateSignature,
  verifySignature,
  getValidationUrl,
};
