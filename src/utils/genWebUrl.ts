export function genWebUrl(url: string, vault: string, query: string) {
	return `${url}?vault=${vault}&query=${query}`;
}
