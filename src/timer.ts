import * as vscode from "vscode";

import { formatTime } from "./utils";
import { statusBarItem, pauseButton, updateStatusBarColor } from "./statusBar";
import { BREAK_INTERVAL_SECONDS } from "./constants";

let startTime: number;
let elapsedBeforePause = 0;
let interval: NodeJS.Timeout | null = null;
let isFocused = true;
let lastBreakReminderAt = 0;
let totalDailyElapsed = 0;
let currentDate = new Date().toDateString();
export let isTimerPaused = false;

export function initTimer() {
  startTime = Date.now();
  startTimer();
}

export function startTimer() {
  if (interval || isTimerPaused || !isFocused) {
    return;
  }

  interval = setInterval(() => {
    const now = new Date();
    const newDate = now.toDateString();

    if (newDate !== currentDate) {
      currentDate = newDate;
      totalDailyElapsed = 0;
      elapsedBeforePause = 0;
      lastBreakReminderAt = 0;
      startTime = Date.now();

      vscode.window.showInformationMessage(
        "🌅 Nouveau jour ! Le compteur quotidien a été réinitialisé."
      );
    }

    const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalElapsed = elapsedBeforePause + currentElapsed;

    statusBarItem.text = `⏳ Temps écoulé : ${formatTime(totalElapsed)}`;

    if (totalElapsed - lastBreakReminderAt >= BREAK_INTERVAL_SECONDS) {
      lastBreakReminderAt = totalElapsed;
      vscode.window.showInformationMessage(
        "⏰ Tu codes depuis 2h sans interruption 🧠 — pense à faire une pause ☕️"
      );
    }
  }, 1000);
}

export function stopTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  statusBarItem.color = "#999999";
}

export function togglePause() {
  if (isTimerPaused) {
    isTimerPaused = false;
    pauseButton.text = "⏸️ Pause";
    startTime = Date.now();
    startTimer();
  } else {
    isTimerPaused = true;
    pauseButton.text = "▶️ Reprendre";
    elapsedBeforePause += Math.floor((Date.now() - startTime) / 1000);
    stopTimer();
  }
}

export function resetTimer() {
  stopTimer();
  const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
  totalDailyElapsed += isTimerPaused
    ? elapsedBeforePause
    : elapsedBeforePause + currentElapsed;
  startTime = Date.now();
  elapsedBeforePause = 0;
  lastBreakReminderAt = 0;
  isTimerPaused = false;
  pauseButton.text = "⏸️ Pause";
  startTimer();
  updateStatusBarColor(isTimerPaused);
}

export function getTotalTime() {
  const currentElapsed = isTimerPaused
    ? 0
    : Math.floor((Date.now() - startTime) / 1000);
  return totalDailyElapsed + elapsedBeforePause + currentElapsed;
}

const config = vscode.workspace.getConfiguration("codersClock");
const pauseOnDefocus = config.get<boolean>("pauseOnDefocus", true);

export function handleFocusChange(focused: boolean) {
  isFocused = focused;

  if (focused) {
    if (!isTimerPaused) {
      startTime = Date.now();
      startTimer();
      updateStatusBarColor(isTimerPaused);
    }
  } else if (pauseOnDefocus) {
    stopTimer();
    if (!isTimerPaused) {
      elapsedBeforePause += Math.floor((Date.now() - startTime) / 1000);
    }
    updateStatusBarColor(true);
  }
}
