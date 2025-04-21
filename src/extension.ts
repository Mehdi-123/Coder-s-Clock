import * as vscode from "vscode";
import { createStatusBarItems, updateStatusBarColor } from "./statusBar";
import {
  initTimer,
  togglePause,
  resetTimer,
  handleFocusChange,
  isTimerPaused,
} from "./timer";
import { showDailySummary } from "./summary";
import { stopTimer } from "./timer";
import { statusBarItem } from "./statusBar";

export function activate(context: vscode.ExtensionContext) {
  console.log('✅ Extension "coder-s-clock" is now active!');

  createStatusBarItems(context);
  initTimer();

  updateStatusBarColor(isTimerPaused);

  context.subscriptions.push(
    vscode.commands.registerCommand("coder-s-clock.togglePause", () => {
      togglePause();
      updateStatusBarColor(isTimerPaused);
    }),

    vscode.commands.registerCommand("coder-s-clock.resetTimer", () => {
      resetTimer();
    }),

    vscode.commands.registerCommand("coder-s-clock.showDailySummary", () => {
      showDailySummary();
    }),

    vscode.window.onDidChangeWindowState((e) => {
      handleFocusChange(e.focused);
    })
  );
}

export function deactivate() {
  stopTimer();
  statusBarItem.hide();
  statusBarItem.dispose();
}
