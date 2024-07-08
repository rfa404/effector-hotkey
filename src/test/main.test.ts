import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {fireEvent} from "@testing-library/dom";
import {Modifiers} from "../shared/lib/types";
import {$isAltDown, hotkey, keyEvents} from "../index";

const eventType: KeyboardEvent['type'][] = Object.keys(keyEvents);
const keys = ['a', 'b'];
const mods = Object.values(Modifiers);

let testCases: Array<{type: KeyboardEvent['type'], key: string, mod?: Modifiers}> = [];

eventType.forEach((type) => {
    keys.forEach((key) => {
        testCases.push({type, key})

        mods.forEach((mod) => {
            testCases.push({type, key, mod})
        })
    })
})

// testCases.forEach(({type, key, mod}) => {
//     const keyboardEvent = new KeyboardEvent(type, {key});
//     const hotkeyPressed = hotkey({key, type});
//
//     test(`Type: ${type}, Key: ${key}`, () => {
//         const spy = vi.fn();
//         hotkeyPressed.watch(spy);
//
//         fireEvent(document, keyboardEvent);
//
//         expect(spy).toBeCalled();
//     })
//
// })
afterEach(async () => {
    vi.clearAllMocks();
    vi.resetAllMocks();
})

eventType.forEach((type) => {
    keys.forEach((key) => {
        const keyboardEvent = new KeyboardEvent(type, {key});
        afterEach(async () => {
            vi.clearAllMocks();
            vi.resetAllMocks();
        })

        test(`Type: ${type}, Key: ${key}`, () => {
            const hotkeyPressed = hotkey({key, type});
            const spy = vi.fn();
            hotkeyPressed.watch(spy);

            fireEvent(document, keyboardEvent);

            expect(spy).toBeCalled();
        })

        mods.forEach((mod) => {
            console.log(mods);

            const keyboardEvent = new KeyboardEvent(type, {key, altKey: mod === Modifiers.Alt, shiftKey: mod === Modifiers.Shift, ctrlKey: mod === Modifiers.Ctrl});

            console.log('keyboardEvent', keyboardEvent.shiftKey);

            test(`Type: ${type}, Key: ${key}, Mod: ${mod}`, () => {
                const spy = vi.fn();

                afterEach(async () => {
                    vi.clearAllMocks();
                    vi.resetAllMocks();
                })

                const hotkeyPressed = hotkey({key, type});

                hotkeyPressed.watch(spy);

                fireEvent(document, keyboardEvent);

                expect(spy).toBeCalled();
            })
        })
    })
})