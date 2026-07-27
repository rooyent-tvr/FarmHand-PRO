/**
 * Email Provider Factory
 *
 * This file hides the implementation of the
 * actual email provider from the rest of
 * FarmHand PRO.
 */

const provider =
  process.env.EMAIL_PROVIDER || "console";

/**
 * Console Provider
 *
 * Used during development.
 */
async function consoleProvider(email) {
  console.log("========== EMAIL ==========");
  console.log(email);
  console.log("===========================");

  return {
    success: true,
    provider: "console",
    messageId: `DEV-${Date.now()}`,
  };
}

/**
 * Main provider entry point.
 */
export async function send(email) {
  switch (provider.toLowerCase()) {
    case "console":
      return consoleProvider(email);

    default:
      throw new Error(
        `Unsupported email provider: ${provider}`
      );
  }
}

export default {
  send,
};
