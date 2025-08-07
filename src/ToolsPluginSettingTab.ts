import { PluginSettingTab, App, Setting } from "obsidian";
import ToolsPlugin from "./main";

export class ToolsPluginSettingTab extends PluginSettingTab {
	plugin: ToolsPlugin;

	constructor(app: App, plugin: ToolsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Web URL")
			.setDesc(
				"URL of the page that redirects to the Obsidian standalone app"
			)
			.addText((text) =>
				text
					.setPlaceholder("https://domain.com/path/")
					.setValue(this.plugin.settings.webUrlSetting)
					.onChange(async (value) => {
						this.plugin.settings.webUrlSetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
