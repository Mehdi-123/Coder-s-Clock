import * as vscode from "vscode";
import { zenColors } from "./constants";

let currentColorIndex = 0;

export let statusBarItem: vscode.StatusBarItem;
export let pauseButton: vscode.StatusBarItem;
export let resetButton: vscode.StatusBarItem;
export let summaryButton: vscode.StatusBarItem;

export function createStatusBarItems(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.show();

  pauseButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  pauseButton.text = "⏸️ Pause";
  pauseButton.command = "coder-s-clock.togglePause";
  pauseButton.tooltip = "Pause ou reprendre le timer";
  pauseButton.show();
  context.subscriptions.push(pauseButton);

  resetButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    98
  );
  resetButton.text = "🔁 Réinitialiser";
  resetButton.command = "coder-s-clock.resetTimer";
  resetButton.tooltip = "Réinitialiser le timer";
  resetButton.show();
  context.subscriptions.push(resetButton);

  summaryButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    97
  );
  summaryButton.text = "📊 Résumé";
  summaryButton.command = "coder-s-clock.showDailySummary";
  summaryButton.tooltip = "Afficher le résumé de la journée";
  summaryButton.show();
  context.subscriptions.push(summaryButton);
}

export function updateStatusBarColor(paused = false) {
  if (paused) {
    statusBarItem.color = "#999999";
  } else {
    statusBarItem.color = zenColors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % zenColors.length;
  }
}
