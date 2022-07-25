import * as vscode from "vscode";
import { runshellasadmin } from "./RunShellAsAdmin";

// extension entrypoint
export function activate(context: vscode.ExtensionContext) {
    runshellasadmin.activate(context);
}
export function deactivate() {}
