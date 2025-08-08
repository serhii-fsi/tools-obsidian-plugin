# Obsidian Tools Plugin

This plugin provides several tools to enhance your Obsidian workflow.

## Features

-   **Insert Timestamp:** Adds a timestamp to your notes with a simple command.
-   **Share Note:** Generates a shareable link or URL for your notes.
-   **Customizable Base URL:** Allows you to configure the base URL for shared notes.

## Installation

1.  Copy the plugin folder `tools-obsidian-plugin` to your Obsidian plugins folder: `<vault>/.obsidian/plugins/`.
2.  Reload Obsidian.
3.  Go to `Settings` -> `Community plugins` and enable "Tools Plugin".
4.  Configure the plugin settings in `Settings` -> `Tools Plugin`.

## Usage

### Insert Timestamp

-   Use the command "Insert Timestamp" (you can find it in the command palette).
-   Alternatively, use the hotkey `Alt+T` (you can customize this in the hotkey settings).

### Share Note

1.  Click the "Share Note" ribbon icon.
2.  Choose either "Share Link" or "Share URL":

    -   **Share URL:** Copies a direct URL to the note to your clipboard.
    -   **Share Link:** Copies an HTML link to the note (including a preview) to your clipboard, allowing for rich previews in supporting apps.

    The URL will redirect to a web page that opens the note in the Obsidian app (assuming the user has the app installed and the vault configured).

## Configuration

You can configure the following settings in the plugin settings tab:

-   **Base URL:** The URL of the web page that redirects to the Obsidian app. This is essential for the "Share Note" feature to work correctly. For example: `https://your-domain.com/obsidian-redirect/`.

## Development

### Prerequisites

-   Node.js
-   npm (or yarn)
-   Typescript

### Getting Started

1.  Clone this repository.
2.  Run `npm install` to install dependencies.
3.  Create a `.env` file in the root directory. See `.env-example` for the required environment variables.
4.  Run `npm run dev-with-copy` to start the development server and automatically copy the plugin files to your Obsidian plugins folder on every change.
5.  Reload Obsidian to see the changes.

### Building

Run `npm run build` to build the plugin. The output will be in the `dist` folder.
Run `npm run build-with-copy` to build and copy to your Obsidian plugin folder at once.

### Environment Variables

-   `OBSIDIAN_PLUGIN_PATH`: The path to your Obsidian plugins folder. This is used to automatically copy the plugin files to your Obsidian plugins folder during development and build processes.

### Scripts

-   `dev`: Runs the esbuild development server.
-   `build`: Builds the plugin.
-   `version`: Bumps the plugin version and adds the updated manifest file to git.
-   `copy-plugin`: Copies the plugin files to your Obsidian plugins folder.
-   `dev-with-copy`: Runs the development server and automatically copies the plugin files to your Obsidian plugins folder on every change.
-   `build-with-copy`: Builds the plugin and copies the plugin files to your Obsidian plugins folder.

### Dist Web

The `dist-web` directory contains a simple HTML page (`index.html`) that handles the redirection from a web URL to the Obsidian app. This page reads the `vault` and `query` parameters from the URL and constructs an Obsidian URL (obsidian://...) to open the app and perform a search within the specified vault. You will need to deploy the contents of this directory to the server you specified as the `Base URL` in the plugin settings.

## License

MIT
