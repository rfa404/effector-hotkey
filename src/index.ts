import {
  createEvent,
  createStore,
  Event,
  sample,
  Store,
  UnitTargetable,
} from 'effector';
import { validateHotkey } from './shared/lib/validate-hotkey';

export const keyup = createEvent<KeyboardEvent>();
export const keydown = createEvent<KeyboardEvent>();
export const keypress = createEvent<KeyboardEvent>();

export const keyEvents: {[key: string]: Event<KeyboardEvent>} = {
  keyup,
  keydown,
  keypress,
};

export const $isShiftDown = createStore(false);
export const $isCtrlDown = createStore(false);
export const $isAltDown = createStore(false);

$isShiftDown.on([keyup, keydown], (prev, evt) => evt.shiftKey);
$isCtrlDown.on([keyup, keydown], (prev, evt) => evt.ctrlKey);
$isAltDown.on([keyup, keydown], (prev, evt) => evt.altKey);

export interface HotkeyT {
  (params: {
    key: KeyboardEvent['key'];
    type: keyof typeof keyEvents;
    filter?: Store<boolean>;
    target?: UnitTargetable<unknown> | UnitTargetable<unknown>[];
  }): Event<KeyboardEvent>;
}

/** Returns `Event` that gets triggered when a certain key pressed (or keyup/keydown events triggered) */
  export const hotkey: HotkeyT = ({ key, type, filter, target }) => {
  let keyEvent = keyEvents[type] ?? keyEvents.keyup;

  let keyTriggered = sample({
    clock: keyEvent,
    filter: validateHotkey(key),
  });

  if (filter) {
    keyTriggered = sample({
      clock: keyTriggered,
      filter: filter,
    });
  }

  if (target) {
    // @ts-expect-error починить типизацию для UnitTargetable[] в target
    sample({
      clock: keyTriggered,
      target: target,
    });
  }

  return keyTriggered;
};

if (typeof document !== 'undefined') {
  document.addEventListener('keyup', evt => keyup(evt));
  document.addEventListener('keydown', evt => keydown(evt));
  document.addEventListener('keypress', evt => keypress(evt));
}
