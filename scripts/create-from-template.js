const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter new project name: ", (projectName) => {
  rl.close();

  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);
  const newProjectPath = path.join(parentDir, projectName);

  try {
    // 1. Remove .git folder
    const gitPath = path.join(currentDir, ".git");
    if (fs.existsSync(gitPath)) {
      fs.rmSync(gitPath, { recursive: true, force: true });
      console.log("✅ Removed .git folder");
    }

    // 2. Rename enclosing folder
    fs.renameSync(currentDir, newProjectPath);
    console.log(`✅ Renamed folder to "${projectName}"`);

    // 3. Initialize new git repo
    execSync("git init", { cwd: newProjectPath });
    console.log("✅ Initialized new git repository");

    // 4. Do initial commit
    execSync("git add .", { cwd: newProjectPath });
    execSync('git commit -m "Initial commit from template"', {
      cwd: newProjectPath,
    });
    console.log("✅ Created initial commit");

    // 5. Delete this script from package.json
    const packageJsonPath = path.join(newProjectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    delete packageJson.scripts["eject:danger"];
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
    );
    console.log("✅ Removed 'eject:danger' script from package.json");

    // 6. Delete the scripts directory
    const scriptsDir = path.join(newProjectPath, "scripts");
    fs.rmSync(scriptsDir, { recursive: true, force: true });
    console.log("✅ Removed scripts directory");

    console.log(
      `\n🎉 Template setup complete! Your new project is ready at: ${newProjectPath}`,
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
});
