# AI Code Modifier - VSCode Extension

## Features
- Highlight Python code and request AI-driven modifications to improve the code.
- Enter a custom prompt to specify the type of improvements or modifications desired.

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Press `F5` in VSCode to run the extension

## Configuration
1. Obtain an API key from [Fireworks AI](https://fireworks.ai).
2. Set your Fireworks API key in the code (`YOUR_FIREWORKS_API_KEY`).

## Usage
1. Highlight Python code in the editor.
2. Right Click or Press `Ctrl+Shift+P` and select `Modify Code with AI`.
3. Enter your custom prompt when prompted.
4. The selected code will be sent to the AI API and replaced with the improved version.

## Development
- Modify `callAIAPI` function in `extension.js` to customize the API call parameters and response handling.
