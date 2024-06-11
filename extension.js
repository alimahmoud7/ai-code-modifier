// The module 'vscode' contains the VS Code extensibility API

const vscode = require("vscode");
const axios = require("axios");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  //   console.log('Congratulations, your extension "ai-modifier" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "ai-modifier.modifyCode",
    async () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      //   vscode.window.showInformationMessage("Hello World from AI Modifier!");

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text.trim() == "") {
          vscode.window.showInformationMessage("You must select code!");
          return;
        }

        // Prompt the user to enter a custom input
        const userPrompt = await vscode.window.showInputBox({
          prompt: "Enter your prompt for the AI",
          placeHolder:
            "E.g., Improve this code by fixing errors and optimizing performance",
        });

        if (userPrompt.trim() == "") {
          vscode.window.showInformationMessage(
            "You must enter a prompt message!"
          );
          return;
        }

        // Call AI API with the selected text
        const modifiedText = await callAIAPI(text, userPrompt);

        // Replace selected text with modified text
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, modifiedText);
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function callAIAPI(text, userPrompt) {
  const API_KEY = "YOUR_FIREWORKS_API_KEY";
  try {
    const sysPrompt = `You are a Python code assistant. You must output valid and complete Python code only. Follow the best practices. Please ensure the code is linted & formatted. Do not describe the code.`;
    const userPromptwithText = `
	${userPrompt}
	----------
	INPUT CODE
	----------
	${text}
	`;
	
    const response = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "accounts/fireworks/models/llama-v3-70b-instruct",
        messages: [
          {
            role: "system",
            content: sysPrompt,
          },
          {
            role: "user",
            content: userPromptwithText,
          },
        ],
        max_tokens: 1000,
        stream: false,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check the response format from Fireworks API and extract the modified text
    if (response.data && response.data.choices && response.data.choices[0]) {
      let resp = response.data.choices[0].message.content;
	//   console.log(resp)
      resp = resp.replaceAll("```", "").trimLeft();
      return resp;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    vscode.window.showErrorMessage("AI API call failed: " + error.message);
    console.error("AI API call error:", error);
    return text;
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
