import {Modifiers} from "./types";

export const validateHotkey = (hotkey: string) => {
  const splitKeys = hotkey.split('+');

  const hasShift = splitKeys.includes(Modifiers.Shift);
  const hasCmd = splitKeys.includes(Modifiers.Cmd) || splitKeys.includes(Modifiers.Ctrl);
  const hasOption = splitKeys.includes(Modifiers.Option) || splitKeys.includes(Modifiers.Alt);

  return (evt: KeyboardEvent) => {
    if (hasShift && !evt.shiftKey) {
      return false;
    }
    if (hasCmd && !(evt.metaKey || evt.ctrlKey)) {
      return false;
    }
    if (hasOption && !evt.altKey) {
      return false;
    }
    return splitKeys.some(s => s === evt.key || s === evt.code);
  };
};
