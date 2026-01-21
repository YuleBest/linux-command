const fs = require("fs");
const path = require("path");

const COMMAND_DIR = path.join(__dirname, "../public/linux-command/command");
const OUTPUT_FILE = path.join(__dirname, "../public/command_index.json");

function generateIndex() {
  if (!fs.existsSync(COMMAND_DIR)) {
    console.error(`Directory not found: ${COMMAND_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(COMMAND_DIR)
    .filter((file) => file.endsWith(".md"));
  const index = [];

  console.log(`Found ${files.length} command files. Processing...`);

  files.forEach((file) => {
    const filePath = path.join(COMMAND_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Extract name (Line 1)
    const name = lines[0].trim();

    // Extract description (Line 4 or first non-empty line after ===)
    let description = "";
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && line !== "===" && !line.startsWith("#")) {
        description = line;
        break;
      }
    }

    index.push({
      n: name,
      d: description,
      p: name, // Using name as the path identifier
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Successfully generated index to ${OUTPUT_FILE}`);
}

generateIndex();
