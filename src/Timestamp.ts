import { Editor, MarkdownView } from "obsidian";
import ToolsPlugin from "./main";
import { genTimestamp } from "./utils/genTimestamp";

export class Timestamp {
	private plugin: ToolsPlugin;

	constructor(plugin: ToolsPlugin) {
		this.plugin = plugin;
		this.init();
	}

	init() {
		this.plugin.addCommand({
			id: "insert-timestamp",
			name: "Insert Timestamp",
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: "T",
				},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insert(editor, view);
			},
		});
	}

	insert(editor: Editor, view: MarkdownView) {
		const timestamp = genTimestamp();
		editor.replaceSelection(timestamp);
	}
}
