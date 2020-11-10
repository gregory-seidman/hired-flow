
const storage = window.localStorage;
const configListKey = "JobSearch:ConfigIds";

export function loadJobSearchIds(): string[] {
    return JSON.parse(storage[configListKey] || "[]");
}

export function appendJobSearchId(id: string): void {
    const configIds = loadJobSearchIds();
    configIds.push(id);
    storage[configListKey] = JSON.stringify(configIds);
}

