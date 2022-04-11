import {
  guard,
  createEvent,
  Event,
  Store,
  Target,
  sample,
  Subscription,
  createStore,
} from 'effector';
import { validateHotkey } from './utils/validate-hotkey';

export const keyup = createEvent<KeyboardEvent>();
export const keydown = createEvent<KeyboardEvent>();
export const keypress = createEvent<KeyboardEvent>();

export const $isShiftDown = createStore(false);
export const $isCtrlDown = createStore(false);
export const $isAltDown = createStore(false);

$isShiftDown.on([keyup, keydown], (prev, evt) => evt.shiftKey);
$isCtrlDown.on([keyup, keydown], (prev, evt) => evt.ctrlKey);
$isAltDown.on([keyup, keydown], (prev, evt) => evt.altKey);

const keyEvents = {
  keyup,
  keydown,
  keypress,
};

interface hotkeyT {
  (key: KeyboardEvent['key'], type?: keyof typeof keyEvents): Event<
    KeyboardEvent
  >;
  (params: {
    key: KeyboardEvent['key'];
    type?: keyof typeof keyEvents;
    filter?: Store<boolean>;
    target: Target;
  }): Subscription;
  (params: {
    key: KeyboardEvent['key'];
    type?: keyof typeof keyEvents;
    filter?: Store<boolean>;
  }): Event<KeyboardEvent>;
}

/** Returns `Event` that gets triggered when a certain key pressed (or keyup/keydown events triggered) */
// @ts-expect-error
export const hotkey: hotkeyT = (...args) => {
  const normalizedParams =
    typeof args[0] === 'string' ? { key: args[0], type: args[1] } : args[0];
  let keyTriggered = guard({
    clock: keyEvents[normalizedParams.type || 'keyup'],
    filter: validateHotkey(normalizedParams.key),
  });
  if (normalizedParams.filter) {
    keyTriggered = guard({
      clock: keyTriggered,
      filter: normalizedParams.filter,
    });
  }
  if (normalizedParams.target) {
    return sample({
      clock: keyTriggered,
      // @ts-expect-error
      target: normalizedParams.target,
    });
  }
  return keyTriggered;
};

if (typeof document !== 'undefined') {
  document.addEventListener('keyup', evt => keyup(evt));
  document.addEventListener('keydown', evt => keydown(evt));
  document.addEventListener('keypress', evt => keypress(evt));
}
