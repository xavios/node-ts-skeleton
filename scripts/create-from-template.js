import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { execSync } from "node:child_process";

const VALID_NAME = /^[a-z0-9][a-z0-9._-]*$/i;

async function getProjectName() {
  const fromArgs = process.argv[2];
  if (fromArgs) return fromArgs.trim();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question("Enter new project name: ");
  rl.close();
  return answer.trim();
}

function main(projectName) {
  if (!VALID_NAME.test(projectName)) {
    throw new Error(
      `Invalid project name "${projectName}". Use letters, numbers, ".", "_" and "-" only.`,
    );
  }

  const currentDir = process.cwd();
  const newProjectPath = path.join(path.dirname(currentDir), projectName);

  if (fs.existsSync(newProjectPath)) {
    throw new Error(`"${newProjectPath}" already exists.`);
  }

  // 1. Update package.json before anything destructive happens
  const packageJsonPath = path.join(currentDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.name = projectName;
  packageJson.version = "0.0.0";
  packageJson.author = "";
  delete packageJson.scripts["eject:danger"];
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
  console.log("✅ Updated package.json (name, version, author, scripts)");

  // 2. Remove this script and its directory
  fs.rmSync(path.join(currentDir, "scripts"), { recursive: true, force: true });
  console.log("✅ Removed scripts directory");

  // 3. Remove .git folder
  const gitPath = path.join(currentDir, ".git");
  if (fs.existsSync(gitPath)) {
    fs.rmSync(gitPath, { recursive: true, force: true });
    console.log("✅ Removed .git folder");
  }

  // 4. Rename enclosing folder
  fs.renameSync(currentDir, newProjectPath);
  console.log(`✅ Renamed folder to "${projectName}"`);

  // 5. Initialize new git repo with an initial commit
  execSync("git init", { cwd: newProjectPath });
  console.log("✅ Initialized new git repository");
  execSync("git add .", { cwd: newProjectPath });
  execSync('git commit -m "Initial commit from template"', {
    cwd: newProjectPath,
  });
  console.log("✅ Created initial commit");

  console.log(
    `\n🎉 Template setup complete! Your new project is ready at: ${newProjectPath}`,
  );
  console.log(`Next: cd "${newProjectPath}" && yarn install`);
}

try {
  main(await getProjectName());
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
