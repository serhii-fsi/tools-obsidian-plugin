import { Menu, Notice } from "obsidian";
import ToolsPlugin from "./main";
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

		menu.addItem((item) =>
			item.setTitle("Share URL").onClick(() => {
				this.share(ShareType.URL);
			})
		);

		menu.showAtMouseEvent(evt);
	}

	async share(shareType: ShareType) {
		const activeFile = this.plugin.app.workspace.getActiveFile();

		if (activeFile) {
			try {
				// Get note id
				const noteIdObj = new NoteId(this.plugin, activeFile);
				const noteId = await noteIdObj.getNoteId();
				if (!noteId) return;

				const baseUrl = this.plugin.settings.baseUrlSetting;
				const vaultName = this.plugin.app.vault.getName();
				const noteName = activeFile.basename;

				if (shareType === ShareType.URL) {
					const clipboard = genWebUrl(baseUrl, vaultName, noteId);

					await navigator.clipboard.writeText(clipboard);
				} else if (shareType === ShareType.LINK) {
					const anchorText = `🗈 ${vaultName}: ${noteName}`;
					const html = genWebLink(
						baseUrl,
						vaultName,
						noteId,
						anchorText
					);
					const text = genWebUrl(baseUrl, vaultName, noteId);

					const clipboardItem = new ClipboardItem({
						"text/html": new Blob([html], { type: "text/html" }),
						"text/plain": new Blob([text], { type: "text/plain" }),
					});

					await navigator.clipboard.write([clipboardItem]);
				}
			} catch (e) {
				new Notice(`Error reading or modifying file: ${e}`);
			}
		} else {
			new Notice("No active file found");
		}
	}
}
