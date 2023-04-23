// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const { showObx } = require("./main");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let showObxFull = vscode.commands.registerCommand(
    "getx-park.showObxFull",
    function () {
      showObx(vscode, false);
    }
  );
  let showObxHalf = vscode.commands.registerCommand(
    "getx-park.showObxHalf",
    function () {
      showObx(vscode, true);
    }
  );
  // context.subscriptions.push(disposable);
  // push both function to context.subscriptions
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    200
  );
  myStatusBarItem.text = "GetX";
  myStatusBarItem.command = "getx-park.showObxFull";
  myStatusBarItem.show();

  context.subscriptions.push(showObxFull, showObxHalf);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
