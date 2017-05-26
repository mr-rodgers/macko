// Mock the 'plugin-hooker/backends' import
import MockBackend from "../../../__mocks__/plugin-hooker/backend";
jest.mock("plugin-hooker/backends", () => ({Jspm: MockBackend}));

import MockPackage from "../../../__mocks__/plugin-hooker/package";
import { PluginStore } from "../plugins";

beforeEach(() => {
     MockBackend.setPackages("/test/plugin/set", [
        new MockPackage("foo", { name: "Foo"}, [
            { info: { name: "ThirtyTwo", hook: "numbers" }, value: 32 },
            { info: { name: "Nine", hook: "numbers" }, value: 9 },
        ]),
    ]);
});

test("#watchImplementations picks up existing implementations", (done) => {
    const plugins = new PluginStore("/test/plugin/set");

    plugins.watchImplementations<number>("numbers")
        .subscribe((numbers) => tryInsideSubscribe(() => expect(numbers.sort((a, b) => a - b)).toEqual([9, 32]), done));
});

test("#watchImplementations picks up new implementations", (done) => {
    const plugins = new PluginStore("/test/plugin/set/1");

    plugins.watchImplementations<number>("numbers")
        .subscribe((numbers) => {
            if (!numbers.length) { return; }
            tryInsideSubscribe(() => expect([1, 2, 3, 5, 7]).toEqual(numbers.sort((a, b) => a - b)), done);
        });

    // Add these implementations after we start watching
    MockBackend.addPackage("/test/plugin/set/1", new MockPackage("small-primes", { name: "Small Prime Numbers" }, [
        { info: { name: "One", hook: "numbers" }, value: 1},
        { info: { name: "Two", hook: "numbers" }, value: 2},
        { info: { name: "Three", hook: "numbers" }, value: 3},
        { info: { name: "Five", hook: "numbers" }, value: 5},
        { info: { name: "Seven", hook: "numbers" }, value: 7},
    ]));
});

test("#watchImplementations adds unique `__macko_impl_id__` type to implementations", (done) => {
    const plugins = new PluginStore("/test/plugin/set");

    plugins.watchImplementations<number>("numbers")
        .map((numbers) => numbers.map((ni) => ni.__macko_impl_id__))
        .subscribe((iids) => tryInsideSubscribe(() => expect(new Set(iids).size).toEqual(iids.length), done));
});

function tryInsideSubscribe(f: () => void, done: jest.DoneCallback) {
    try {
        f();
    } catch (err) {
        done.fail(err);
    }
    done();
}
