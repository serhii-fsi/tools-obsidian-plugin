import { TFile, Notice } from "obsidian";
import ToolsPlugin from "./main";
import { NoteProperties } from "./NoteProperties";
import { generateUID } from "./utils/generateUID";

const NOTE_ID_NAME = "noteid";

export class NoteId {
	private plugin: ToolsPlugin;
	private activeFile: TFile;

	constructor(plugin: ToolsPlugin, activeFile: TFile) {
		this.plugin = plugin;
		this.activeFile = activeFile;
	}

	async getNoteId(): Promise<string | undefined> {
		const noteProps = new NoteProperties(this.plugin, this.activeFile);

		// Read
		let noteId = noteProps.readProp(NOTE_ID_NAME);

		// Add
		if (typeof noteId !== "string") {
			noteId = generateUID();
			const res = await noteProps.addProp(NOTE_ID_NAME, noteId);
			if (!res) {
				console.error("Failed to add note ID to properties");
				new Notice("Failed to add note ID to properties");
				return undefined;
			}
		}

		return noteId;
	}
}
