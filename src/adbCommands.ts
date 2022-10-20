import { execSync } from "child_process";

export const adbCommands = {
  wakeUp: () => {
    execSync(`adb shell "input keyevent KEYCODE_WAKEUP"`);
  },
  unlock: () => {
    execSync(`adb shell "input text ${process.env.PHONE_PASS}"`);
    execSync(`adb shell "input keyevent 66"`);
  },
  tap: (location: [number, number]) => {
    execSync(`adb shell "input tap ${location.join(" ")}"`);
  },
  swipe: (
    startLocation: [number, number],
    endLocation: [number, number],
    durationMS: number
  ) => {
    execSync(
      `adb shell input swipe ${startLocation.join(" ")} ${endLocation.join(
        " "
      )} ${durationMS}`
    );
  },
  initiateActivity: (activityName: string) => {
    execSync(`adb shell "am start -n ${activityName}"`);
  },
  screencap: () => {
    execSync(`adb exec-out screencap -p > screen.png`);
  },
};
