import * as vscode from "vscode";

import {
  createStatusBarItems,
  updateStatusBarColor,
  statusBarItem,
} from "./statusBar";
import {
  initTimer,
  togglePause,
  resetTimer,
  handleFocusChange,
  isTimerPaused,
  stopTimer,
} from "./timer";
import { showDailySummary } from "./summary";

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
