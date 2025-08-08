import { genWebUrl } from "./genWebUrl";

export function genWebLink(
	url: string,
	vault: string,
	query: string,
	anchorText: string
) {
	const completeUrl = genWebUrl(url, vault, query);
	return `<a href="${completeUrl}" target="obsidian_web_url_target">${anchorText}</a>`;
}
