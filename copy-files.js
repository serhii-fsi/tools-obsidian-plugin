import { exec } from "child_process";

const obsidianPluginPath = process.env.OBSIDIAN_PLUGIN_PATH;

if (!obsidianPluginPath) {
	console.error("OBSIDIAN_PLUGIN_PATH not defined in .env");
	process.exit(1);
}

const command = `cp main.js manifest.json styles.css ${obsidianPluginPath}`;

exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error copying files: ${error}`);
		return;
	}
	console.log(`Files copied to ${obsidianPluginPath}`);
	if (stderr) {
		console.log(`stderr: ${stderr}`);
	}
});
