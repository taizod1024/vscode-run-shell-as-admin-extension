import * as vscode from "vscode";
import * as fs from "fs";
const path = require("path");
import child_process, { ExecFileSyncOptions } from "child_process";

/** run-shell-as-admin-extesnion class */
class RunShellAsAdmin {
    /** application id for vscode */
    public appid = "run-shell-as-admin";

    /** channel on vscode */
    public channel: vscode.OutputChannel;

    /** project path */
    public projectPath: string;

    /** app path */
    public appPath: string;

    /** extension path */
    public extensionPath: string;

    /** constructor */
    constructor() {}

    /** activate extension */
    public activate(context: vscode.ExtensionContext) {
        // init context
        this.channel = vscode.window.createOutputChannel(this.appid);
        if (!process.env.WINDIR) {
            this.channel.appendLine(`[${this.timestamp()}] ${this.appid} failed, no windir`);
            return;
        }
        this.channel.appendLine(`[${this.timestamp()}] ${this.appid} activated`);

        // init vscode
        context.subscriptions.push(
            vscode.commands.registerCommand(`${this.appid}.runCmd`, async (uri: vscode.Uri) => {
                this.extensionPath = context.extensionPath;
                try {
                    await this.checkWinDirAsync();
                    const stats = fs.statSync(uri.fsPath);
                    if (stats.isDirectory()) {
                        await this.runCmdAsync(uri.fsPath);
                    } else if (stats.isFile()) {
                        await this.runCmdAsync(path.dirname(uri.fsPath));
                    }
                } catch (reason) {
                    this.channel.show();
                    runshellasadmin.channel.appendLine("**** " + reason + " ****");
                }
            })
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(`${this.appid}.runPowerShell`, async (uri: vscode.Uri) => {
                this.extensionPath = context.extensionPath;
                try {
                    await this.checkWinDirAsync();
                    const stats = fs.statSync(uri.fsPath);
                    if (stats.isDirectory()) {
                        await this.runPowerShellAsync(uri.fsPath);
                    } else if (stats.isFile()) {
                        await this.runPowerShellAsync(path.dirname(uri.fsPath));
                    }
                } catch (reason) {
                    this.channel.show();
                    runshellasadmin.channel.appendLine("**** " + reason + " ****");
                }
            })
        );
    }

    /** check project path */
    public async checkWinDirAsync() {
        // show channel
        this.channel.appendLine(`--------`);
        this.channel.appendLine(`[${this.timestamp()}] checkWinDirAsync:`);

        // check windows directory
        const windir = process.env.windir;
        this.channel.appendLine(`[${this.timestamp()}] windir=${windir}`);
        if (windir === undefined) {
            throw "ERROR: no windir";
        }
    }

    /** run cmd async */
    public async runCmdAsync(dir: string) {
        // show channel
        this.channel.appendLine(`--------`);
        this.channel.appendLine(`[${this.timestamp()}] runCmdAsync:`);
        this.channel.appendLine(`[${this.timestamp()}] dir=${dir}`);

        // exec command as administrator
        let cmd = `powershell -command start-process 'cmd.exe' -ArgumentList '/k "cd /d ${dir}"' -verb runas`;
        this.channel.appendLine(`[${this.timestamp()}] command=${cmd}`);
        this.execCommand(cmd);
    }

    /** run powershell async */
    public async runPowerShellAsync(dir: string) {
        // show channel
        this.channel.appendLine(`--------`);
        this.channel.appendLine(`[${this.timestamp()}] runPowerShellAsync:`);
        this.channel.appendLine(`[${this.timestamp()}] dir=${dir}`);

        // exec command as administrator
        let cmd = `powershell -command start-process 'cmd.exe' -ArgumentList '/c "cd /d ${dir} && powershell"' -verb runas`;
        this.channel.appendLine(`[${this.timestamp()}] command=${cmd}`);
        this.execCommand(cmd);
    }

    /** execute command */
    public execCommand(cmd: string, trim = true): string {
        let text = null;
        try {
            const options = { cwd: this.projectPath };
            text = child_process.execSync(cmd, options).toString();
            if (trim) text = text.trim();
        } catch (ex) {}
        return text;
    }

    /** return timestamp string */
    public timestamp(): string {
        return new Date().toLocaleString("ja-JP").split(" ")[1];
    }
}
export const runshellasadmin = new RunShellAsAdmin();
