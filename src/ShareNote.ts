import { Editor, MarkdownView, Menu, Notice, TFile } from "obsidian";
import ToolsPlugin from "./main";
import { NoteProperties } from "./NoteProperties";
import { genUID } from "./utils/genUID";
import { NoteId } from "./NoteId";
import { genWebUrl } from "./utils/genWebUrl";
import { genWebLink } from "./utils/genWebLink";

enum ShareType {
	LINK,
	URL,
}

export class ShareNote {
	private plugin: ToolsPlugin;

	constructor(plugin: ToolsPlugin) {
		this.plugin = plugin;
		this.addRibbonIcon();
	}

	addRibbonIcon() {
		const ribbonIconEl = this.plugin.addRibbonIcon(
			"share-2",
			"Share Note",
			(evt: MouseEvent) => {
				this.addMenu(evt);
			}
		);

		ribbonIconEl.addClass("tools-plugin-ribbon-class");
	}

	addMenu(evt: MouseEvent) {
		const menu = new Menu();

		menu.addItem((item) =>
			item.setTitle("Share Link").onClick(async () => {
				this.share(ShareType.LINK);
			})
		);

		// menu.addItem((item) =>
		// 	item.setTitle("Share URL").onClick(() => {
		// 		this.share(ShareType.URL);

		// 		const activeFile = this.app.workspace.getActiveFile();
		// 		if (activeFile) {
		// 			const vaultName = this.app.vault.getName();
		// 			const noteName = activeFile.basename;
		// 			navigator.clipboard.writeText(`${vaultName}:${noteName}`);
		// 			new Notice(`Vault: ${vaultName}, Note: ${noteName}`);
		// 		} else {
		// 			new Notice("No active file found.");
		// 		}
		// 	})
		// );

		menu.showAtMouseEvent(evt);
	}

	async share(type: ShareType) {
		const activeFile = this.plugin.app.workspace.getActiveFile();

		if (activeFile) {
			try {
				const noteIdObj = new NoteId(this.plugin, activeFile);
				const noteId = await noteIdObj.getNoteId();
				if (!noteId) return;

				await navigator.clipboard.writeText(noteId);

				//  new Notice("!!!!!!  " + noteProps.readProp("noteId"));

				// const fileContent = await this.app.vault.read(activeFile);
				// const noteIdRegex = /noteId: ID\d+/;
				// const noteIdMatch = fileContent.match(noteIdRegex);

				// if (noteIdMatch) {
				// 	new Notice("Note ID already exists.");
				// } else {
				// 	const newNoteId = "ID" + new Date().getTime();
				// 	const newContent = `---\nnoteId: ${newNoteId}\n---\n${fileContent}`;

				// 	await this.app.vault.modify(activeFile, newContent);
				// 	new Notice(`Note ID added:  ${newNoteId}`);
				// }
			} catch (e) {
				new Notice(`Error reading or modifying file: ${e}`);
			}
		} else {
			new Notice("No active file found");
		}
	}
}
