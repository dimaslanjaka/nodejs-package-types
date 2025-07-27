const fs = require("fs-extra");
const path = require("upath");
const axios = require("axios");
const { marked } = require("marked");
const { execSync } = require("child_process");

const tmp = path.join(__dirname, "tmp/typedoc");

async function buildReadme() {
  /**
   * Build Readme
   */
  const readme = [path.join(__dirname, "readme.md"), path.join(__dirname, "README.md")].filter((str) =>
    fs.existsSync(str)
  )[0];
  const outputReadme = path.join(tmp, "readme.md");
  if (typeof readme === "string") {
    if (fs.existsSync(readme)) {
      let content = await fs.readFile(readme, "utf-8");

      // add changelog if exist
      const changelog = [path.join(__dirname, "changelog.md"), path.join(__dirname, "CHANGELOG.md")].filter((str) =>
        fs.existsSync(str)
      )[0];
      if (typeof changelog === "string") {
        content += "\n\n" + (await fs.readFile(changelog, "utf-8"));
      }

      if (!fs.existsSync(tmp)) await fs.mkdir(tmp, { recursive: true });
      await fs.writeFile(outputReadme, content);
    }
  }

  // Extract local link from readme
  let readmeContent = await fs.readFile(outputReadme, "utf-8");
  const hyperlinks = extractAllLocalLinks(readmeContent);
  for (const link of hyperlinks) {
    // Only process local links (not http/https)
    if (!/^https?:\/\//i.test(link)) {
      const absolutePath = path.resolve(__dirname, link);
      if (fs.existsSync(absolutePath)) {
        const url = getGitHubFileUrl(link);
        try {
          const response = await axios(url, { maxRedirects: 4 });
          // The final URL after redirects is in response.request.res.responseUrl (Node.js)
          const finalUrl = response.request?.res?.responseUrl;
          if (finalUrl) {
            console.log(`🔗 ${link} -> ${finalUrl}`);
            readmeContent = readmeContent.replace(link, finalUrl);
            await fs.writeFile(outputReadme, readmeContent);
          } else {
            const destinationPath = path.join(tmp, link);
            console.log(
              `📄 Copying local link "${link}":\n  Source: "${absolutePath}"\n  Destination: "${destinationPath}"`
            );
            await fs.copy(absolutePath, destinationPath);
          }
        } catch (err) {
          console.error(`Failed to fetch URL for ${link}:`, err.message);
        }
      }
    }
  }
}

module.exports.buildReadme = buildReadme;

/**
 * Extracts all local links (including images, reference, and raw URLs) from markdown text.
 * @param {string} markdownText - Markdown content to parse.
 * @returns {string[]} Array of local link paths.
 */
function extractAllLocalLinks(markdownText) {
  const links = new Set();
  const tokens = marked.lexer(markdownText);
  // Collect reference definitions
  const referenceDefs = {};
  for (const token of tokens) {
    if (token.type === "def") {
      referenceDefs[token.tag] = token.href;
    }
  }
  function walkTokens(tokens) {
    for (const token of tokens) {
      // Standard links
      if (token.type === "link" && token.href) {
        links.add(token.href);
      }
      // Images
      if (token.type === "image" && token.href) {
        links.add(token.href);
      }
      // Reference-style links
      if (token.type === "text" && token.tokens) {
        for (const t of token.tokens) {
          if (t.type === "link" && t.href) {
            links.add(t.href);
          }
          if (t.type === "image" && t.href) {
            links.add(t.href);
          }
          // Reference link: [text][ref]
          if (t.type === "link" && t.ref && referenceDefs[t.ref]) {
            links.add(referenceDefs[t.ref]);
          }
        }
      }
      // Raw URLs in text
      if (token.type === "paragraph" && token.text) {
        // Match local file paths, skip lookbehind for compatibility
        // Compatible regex for local file paths (no lookbehind, valid escapes)
        const urlRegex = /(\.\/|\.\.\/|\/)?[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]{2,}/g;
        let match;
        while ((match = urlRegex.exec(token.text)) !== null) {
          links.add(match[0]);
        }
      }
      if (token.tokens) {
        walkTokens(token.tokens);
      }
    }
  }
  walkTokens(tokens);
  // Remove external links
  return Array.from(links).filter((href) => !/^https?:\/\//i.test(href));
}

/**
 * Get the GitHub URL of a given file path in the repo.
 * @param {string} filePath - The absolute or relative path to the file.
 * @returns {string} GitHub URL of the file (with current branch).
 */
function getGitHubFileUrl(filePath) {
  try {
    // Absolute path
    const absFilePath = path.resolve(filePath);

    // Git root
    const repoRoot = execSync("git rev-parse --show-toplevel").toString().trim();

    // Relative path (from repo root)
    const relativePath = path.relative(repoRoot, absFilePath).replace(/\\/g, "/");

    // Remote URL
    let remoteUrl = execSync("git config --get remote.origin.url").toString().trim();

    // Clean up the remote URL:
    // 1. Remove .git suffix
    remoteUrl = remoteUrl.replace(/\.git$/, "");

    // 2. Convert SSH to HTTPS
    if (remoteUrl.startsWith("git@")) {
      remoteUrl = remoteUrl.replace(/^git@([^:]+):/, "https://$1/");
    }

    // 3. Remove embedded credentials like username:password@
    remoteUrl = remoteUrl.replace(/\/\/.*@/, "//");

    // Branch
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

    // Final GitHub URL
    return `${remoteUrl}/blob/${branch}/${relativePath}`;
  } catch (err) {
    console.error("Failed to get GitHub URL:", err.message);
    return null;
  }
}
module.exports.getGitHubFileUrl = getGitHubFileUrl;
