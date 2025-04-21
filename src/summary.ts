import * as vscode from "vscode";
import { formatTime } from "./utils";
import { getTotalTime } from "./timer";

export function showDailySummary() {
  vscode.window.showInformationMessage(
    `📊 Résumé de la journée :\nTu as codé pendant ${formatTime(
      getTotalTime()
    )} aujourd'hui !`
  );
}
