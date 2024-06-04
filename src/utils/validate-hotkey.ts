export const validateHotkey = (hotkey: string) => {
  const splitKeys = hotkey.split('+');

  const hasShift = splitKeys.includes('Shift');
  const hasCmd = splitKeys.includes('Cmd') || splitKeys.includes('Ctrl');
  const hasOption = splitKeys.includes('Option') || splitKeys.includes('Alt');

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
