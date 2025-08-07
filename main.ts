import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	Menu,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	webUrlSetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	webUrlSetting: "",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"share-2",
			"Share Note",
			(evt: MouseEvent) => {
				const menu = new Menu();
				menu.addItem((item) =>
					item
						.setTitle("Copy search by Id Link")
						.onClick(async () => {
							const activeFile =
								this.app.workspace.getActiveFile();
							if (activeFile) {
								try {
									const fileContent =
										await this.app.vault.read(activeFile);
									const noteIdRegex = /noteid: (.*)/;
									const noteIdMatch =
										fileContent.match(noteIdRegex);

									if (noteIdMatch) {
										new Notice("Note ID already exists.");
									} else {
										const newNoteId =
											"ID" + new Date().getTime();
										const newContent = `---\nnoteid: ${newNoteId}\n---\n${fileContent}`;

										await this.app.vault.modify(
											activeFile,
											newContent
										);
										new Notice(
											`Note ID added: ${newNoteId}`
										);
									}
								} catch (e) {
									new Notice(
										`Error reading or modifying file: ${e}`
									);
								}
							} else {
								new Notice("No active file found.");
							}
						})
				);
				menu.addItem((item) =>
					item.setTitle("Copy search by Id URL").onClick(() => {
						const activeFile = this.app.workspace.getActiveFile();
						if (activeFile) {
							const vaultName = this.app.vault.getName();
							const noteName = activeFile.basename;
							navigator.clipboard.writeText(
								`${vaultName}:${noteName}`
							);
							new Notice(
								`Vault: ${vaultName}, Note: ${noteName}`
							);
						} else {
							new Notice("No active file found.");
						}
					})
				);
				menu.showAtMouseEvent(evt);
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );

		this.initInsertTimestamp();
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

	// Insert Timestamp functionality

	initInsertTimestamp() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "insert-timestamp",
			name: "Insert Timestamp",
			hotkeys: [
				{
					modifiers: ["Alt"], // Alt+T
					key: "T",
				},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insertTimestamp(editor, view);
			},
		});
	}

	insertTimestamp(editor: Editor, view: MarkdownView) {
		const timestamp = this.generateTimestamp();
		editor.replaceSelection(timestamp);
	}

	generateTimestamp() {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, "0");
		const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const year = now.getFullYear();
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		return `${day}/${month}/${year}-${hours}:${minutes}`;
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
