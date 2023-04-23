function showObx(vscode, isHalf) {
  // show info "aaa"
//   vscode.window.showInformationMessage("reviewing... GetX");

  // get all variable from current file
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;
  const text = document.getText();
  const lines = text.split("\n");
  // get all lines that contain c. or ctl. and end with .value or ;       // and not include "'"
  let controllerLines = [];
  lines.forEach((line) => {
    if (
      line.includes("c.") ||
      line.includes("ctl.") ||
      line.includes("controller.") ||
      line.includes("app.")
    ) {
      if (
        line.includes(".value") ||
        (line.includes(";") && !line.includes("'"))
      ) {
        controllerLines.push(line);
      }
    }
    // find Obx()
    if (line.includes("Obx")) {
      controllerLines.push(line);
    }
  });

  let str = "";
  str += "<br><br>";
  // get current file path
  let currentFilePath = document.fileName;
  let obxTabCount = 0;
  // covert controllerLines with <a> to link to that line
  controllerLines.forEach((line) => {
    // if // in line continue
    if (line.includes("//")) {
      return;
    }
    // get line number
    let lineNumber = lines.indexOf(line);

    let showText = "";
    // if line is Obx() then add <br> to separate
    if (line.includes("Obx")) {
      str += "<br>";
      // add tab count
      obxTabCount++;
    }

    // defind mn = Math.min(obxTabCount - 1, 0) if "obx" not included else obxTabCount
    let mn = Math.min(obxTabCount - 1, 0);

    // add tab by obxTabCount
    for (let i = 0; i < mn; i++) {
      showText += "---";
    }
    // if c. or ctl. in line; get only text after c. or ctl.
    if (line.includes("c.")) {
      showText += line.split("c.")[1];
    } else if (line.includes("ctl.")) {
      showText += line.split("ctl.")[1];
    } else if (line.includes("controller.")) {
      showText += line.split("controller.")[1];
    } else if (line.includes("app.")) {
      showText += line.split("app.")[1];
    } else {
      showText += line;
    }

    // tag a to go to previous file at that line
    if (!line.includes("Obx")) {
      // if not include ()
      if (!line.includes("(") && !line.includes(")")) {
        // this is the variable
        // h4 instead of h1
        str += `<h4 style=""> <span class="blink">🔄 </span>${showText} ---> <a href="file://${currentFilePath}#L${lineNumber}">${line}</a></h4>`;
      } else {
        str += `<h4 style="color:grey">${showText} ---> <a href="file://${currentFilePath}#L${lineNumber}">${line}</a></h4>`;
      }
    } else {
      // h1 instead of h4
      str += `<h1>${showText} ---> <a href="file://${currentFilePath}#L${lineNumber}">#</a></h1>`;
    }

    // ex. <a href="file://myfile.txt#L1">Sample link</a>
  });
  // add 30 <br> to str
  for (let i = 0; i < 50; i++) {
    str += "<br>";
  }

  displayMarkdown(vscode, str, isHalf);
}
function displayMarkdown(vscode, body, isHalf) {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  let viewColumn = vscode.ViewColumn.Active;
  if (isHalf) {
    viewColumn = vscode.ViewColumn.Beside;
  }

  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    "skGetX",
    "SK GetX",
    viewColumn,
    {
      // Enable scripts in the webview
      enableScripts: true,
    }
  );

  // get current file name only (not include path
  let currentFileName = editor.document.fileName.split("/").pop();

  // And set its HTML content
  panel.webview.html = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GetX by sk</title>
    <style>
      @keyframes blink {
        0% { opacity: 1.0; }
        50% { opacity: 0.0; }
        100% { opacity: 1.0; }
      }

      .blink {
        animation: blink 1s linear infinite;
      }
      </style>
</head>
<body>
    
    <h1>${currentFileName}</h1>

    ${body}
    <script>
    const vscode = acquireVsCodeApi();

    for (const link of document.querySelectorAll('a[href^="file:"]')) {
        link.addEventListener('click', () => {
            vscode.postMessage({
                command: "open",
                link: link.getAttribute('href'),
            });
        });
    }
    </script>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
</body>
</html>
`;
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === "open") {
      const uri = vscode.Uri.parse(message.link);
      const line = +uri.fragment.substring(1) - 1;
      const editor = await vscode.window.showTextDocument(uri);
      editor.revealRange(
        new vscode.Range(line, 0, line, 0),
        vscode.TextEditorRevealType.InCenterIfOutsideViewport
      );

      // set cursor to that line
      editor.selection = new vscode.Selection(
        new vscode.Position(line + 1, 0),
        new vscode.Position(line + 1, 0)
      );
    }
  });
}

// export both function
module.exports = {
    showObx: showObx,
}