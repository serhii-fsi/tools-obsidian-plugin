import { Plugin } from "obsidian";
import { ToolsPluginSettingTab } from "./ToolsPluginSettingTab";
import { Timestamp } from "./Timestamp";
import { ShareNote } from "./ShareNote";

interface ToolsPluginSettings {
	baseUrlSetting: string;
}

const DEFAULT_SETTINGS: ToolsPluginSettings = {
	baseUrlSetting: "",
};

export default class ToolsPlugin extends Plugin {
	settings: ToolsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ToolsPluginSettingTab(this.app, this));

		// Add timestamp functionality
		new Timestamp(this);

		// This creates an icon in the left ribbon
		new ShareNote(this);
	}

	onunload() {}

	// Settings functionality
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
