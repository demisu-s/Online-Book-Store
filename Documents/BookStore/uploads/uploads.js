const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.openUploadsFolder', function () {
        // Get the path to the "uploads" folder in your workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const uploadsFolderPath = workspaceFolders[0].uri.fsPath + '/uploads';
            
            // Open the folder in VS Code
            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(uploadsFolderPath));
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
