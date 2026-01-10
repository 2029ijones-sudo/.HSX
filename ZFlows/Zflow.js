#!/usr/bin/env node
import fs from "fs";
import readline from "readline";
import path from "path";

// GitHub-supported languages (partial list, can be expanded)
const githubLanguages = [
  "JavaScript", "TypeScript", "Python", "Ruby", "Java", "C", "C++",
  "C#", "Go", "PHP", "Shell", "Swift", "Kotlin", "Rust", "Scala",
  "Objective-C", "Perl", "Haskell", "Lua", "Elixir", "R", "Dart"
];

// Setup readline for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("🚀 Welcome to ZFlow Creator!");

  const name = await ask("Enter a name for your ZFlow: ");

  const steps = [];
  let addMore = true;

  while (addMore) {
    console.log("\n--- Add a Step ---");

    const stepName = await ask("Step name: ");
    const file = await ask("Path to script file: ");

    // Show language options
    console.log("GitHub-supported languages: " + githubLanguages.join(", "));
    const languageInput = await ask("Language (optional, press Enter to auto-detect): ");

    let language = languageInput.trim();
    if (language && !githubLanguages.includes(language)) {
      console.log(`⚠️  Warning: '${language}' is not in the standard GitHub languages list, using as custom.`);
    }

    steps.push({
      name: stepName.trim(),
      file: file.trim(),
      ...(language ? { language } : {})
    });

    const more = await ask("Add another step? (y/n): ");
    addMore = more.toLowerCase().startsWith("y");
  }

  const zflow = { name: name.trim(), steps };

  // Save ZFlow JSON
  const outputFile = path.join(process.cwd(), "zflow.json");
  fs.writeFileSync(outputFile, JSON.stringify(zflow, null, 2));

  console.log(`\n✅ ZFlow created successfully at: ${outputFile}`);
  rl.close();
}

main();
