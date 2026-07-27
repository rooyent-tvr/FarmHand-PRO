import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(
  __dirname,
  "../../templates"
);

/**
 * Read an HTML template.
 */
async function loadTemplate(templateName) {
  const filePath = path.join(
    templatesDir,
    `${templateName}.html`
  );

  return fs.readFile(filePath, "utf8");
}

/**
 * Replace {{PLACEHOLDER}} values.
 */
function replaceVariables(html, variables = {}) {
  let output = html;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;

    output = output.replaceAll(
      placeholder,
      value ?? ""
    );
  }

  return output;
}

/**
 * Render an email template.
 */
export async function renderTemplate(
  templateName,
  variables = {}
) {
  const html = await loadTemplate(templateName);

  return replaceVariables(
    html,
    variables
  );
}

export default {
  renderTemplate,
};
