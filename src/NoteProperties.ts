import { TFile } from "obsidian";
import ToolsPlugin from "./main";

export class NoteProperties {
	private plugin: ToolsPlugin;
	private activeFile: TFile;

	constructor(plugin: ToolsPlugin, activeFile: TFile) {
		this.plugin = plugin;
		this.activeFile = activeFile;
	}

	readProp(key: string): any | undefined {
		const cache = this.plugin.app.metadataCache.getFileCache(
			this.activeFile
		);
		if (cache && cache.frontmatter) {
			return cache.frontmatter[key];
		}
		return undefined;
	}

	async addProp(key: string, value: any): Promise<boolean> {
		try {
			await this.plugin.app.fileManager.processFrontMatter(
				this.activeFile,
				(frontmatter) => {
					frontmatter[key] = value;
				}
			);

			await new Promise((r) => setTimeout(r, 200));

			// Verify the property was actually added
			const newProp = this.readProp(key);
			if (newProp === value) {
				return true;
			} else {
				console.error(
					`Failed to verify property "${key}" was added correctly. Expected "${value}" but "${newProp}" was passed instead`
				);
				return false;
			}
		} catch (e) {
			console.error("Error adding property:", e);
			return false;
		}
	}
}
