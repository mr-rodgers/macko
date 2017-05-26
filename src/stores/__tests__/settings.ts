import { ISettings, Settings } from "../settings";
import WebStorage = require("mock-webstorage");

let settings: ISettings;

beforeEach(() => {
    window.localStorage = new WebStorage() as Storage;
    settings = new Settings();
});

test("#modified is initially null", () => {
    expect(settings.modified).toBe(null);
});

test("#modified gets saved and loaded from storage", () => {
    settings.setItem("Foo", "bar");

    const newSettings = new Settings();

    expect(settings.modified).not.toBe(null);
    expect(newSettings.modified).not.toBe(null);
    expect(settings.modified).toEqual(newSettings.modified);
});

test("#setItem() changes modified", () => {
    expect(settings.modified).toBe(null);
    settings.setItem("Foo bar", "Baz");
    expect(settings.modified).not.toBe(null);
});

test("#removeItem() changes modified", () => {
    window.localStorage.setItem("Foo", "bar");
    expect(settings.modified).toBe(null);

    settings.removeItem("Foo");
    expect(settings.modified).not.toBe(null);
});

test("stored data is persisted across instances", () => {
    settings.setItem("anthem", "we will rock you");

    const newSettings = new Settings();
    expect(newSettings.getItem("anthem")).toBe("we will rock you");
});

test("stored data is persisted within same instance", () => {
    settings.setItem("anthem", "we will rock you");
    expect(settings.getItem("anthem")).toBe("we will rock you");
});

test("#getItem() returns null for missing key", () => {
    expect(settings.getItem("anthem")).toBe(null);
});
