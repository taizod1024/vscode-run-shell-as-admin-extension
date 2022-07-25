import * as vscode from "vscode";
import { packagelogger } from "./PackageLogger";

// extension entrypoint
export function activate(context: vscode.ExtensionContext) {
  packagelogger.activate(context);
}
export function deactivate() {}
