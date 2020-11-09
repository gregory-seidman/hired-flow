import { JobSearchConfig, JobSearchClient, Job } from "../models";
import { Datestamp, today } from "../utils/Datestamp";
import parseJsonWithDatestamp from "../utils/parseJsonWithDatestamp";

const storage = window.localStorage;

function nextId(key: string): string {
    const next: string = storage[key] || "1";
    storage[key] = (+next) + 1;
    return next;
}

const configIdCounterKey = "JobSearch:NextConfigId";

function nextConfigId(): string {
    return "C" + nextId(configIdCounterKey);
}

const jobIdCounterKey = "JobSearch:NextJobId";

function nextJobId(): string {
    return "J" + nextId(jobIdCounterKey);
}

const interactionIdCounterKey = "JobSearch:NextInteractionId";

function nextInteractionId(): string {
    return "I" + nextId(interactionIdCounterKey);
}

enum ObjType {
    Config = "Config",
    Job = "Job",
    JobsList = "JobsList"
}

function keyFor(searchId: string, type: ObjType, id?: string): string {
    return id ? `${searchId}:${type}:${id}` : `${searchId}:${type}`;
}

const configListKey = "JobSearch:ConfigIds";

function loadConfigIds(): string[] {
    return JSON.parse(storage[configListKey] || "[]");
}

function createClient(config: JobSearchConfig): JobSearchClient {
    const client: JobSearchClient = {
        config,
        saveConfig: async () => await saveConfig(client.config),
        loadJobs: async () => await loadJobs(client.config.id!),
        saveJob: async (job: Job) => await saveJob(client.config.id!, job)
    };
    return client;
}

function loadJobSearch(searchId: string): JobSearchClient {
    const key = keyFor(searchId, ObjType.Config);
    if (storage.hasOwnProperty(key)) {
        return createClient(parseJsonWithDatestamp(storage[key]));
    } else {
        throw new Error(`Config not found: '${searchId}'`);
    }
}

async function saveConfig(config: JobSearchConfig): Promise<void> {
    const searchId = config.id || nextConfigId();
    if (!config.id) {
        const configIds = loadConfigIds();
        configIds.push(searchId);
        storage[configListKey] = JSON.stringify(configIds);
        config.id = searchId;
    }
    const key = keyFor(searchId, ObjType.Config);
    config.id = searchId;
    storage[key] = JSON.stringify(config);
}

function loadJobsList(searchId: string): string[] {
    const key = keyFor(searchId, ObjType.JobsList);
    if (!storage.hasOwnProperty(key)) return [];
    return JSON.parse(storage[key]);
}

function saveJobsList(searchId: string, ids: string[]): void {
    const key = keyFor(searchId, ObjType.JobsList);
    storage[key] = JSON.stringify(ids);
}

function loadJob(searchId: string, id: string): Job {
    const key = keyFor(searchId, ObjType.Job, id);
    if (storage.hasOwnProperty(key)) {
        return parseJsonWithDatestamp(storage[key]);
    } else {
        throw new Error(`Job not found: '${searchId}:${id}'`);
    }
}

async function loadJobs(searchId: string): Promise<Job[]> {
    return loadJobsList(searchId).map(id => loadJob(searchId, id));
}

async function saveJob(searchId: string, job: Job): Promise<void> {
    const jobId = job.id || nextJobId();
    const key = keyFor(searchId, ObjType.Job, jobId);
    if (!job.id) {
        const ids = loadJobsList(searchId);
        ids.push(jobId);
        saveJobsList(searchId, ids);
        job.id = jobId;
    }
    job.interactions.forEach(i => { if (!i.id) i.id = nextInteractionId(); });
    storage[key] = JSON.stringify(job);
}

export async function loadJobSearches(): Promise<JobSearchClient[]> {
    const configIds = loadConfigIds();
    return configIds.map(loadJobSearch);
}

export function createJobSearch(name: string): JobSearchClient {
    const config: JobSearchConfig = {
        name,
        createdAt: today(),
        fieldOrder: [
            "company",
            "jobTitle",
            "contact",
            "_lastInteractionDate",
            "_nextInteractionDate",
            "details.workLocation",
            "details.techStack",
            "details.healthInsurance",
            "details.401k",
            "status"
        ],
        fieldNames: {
            "details.workLocation": "Location",
            "details.techStack": "Tech Stack",
            "details.healthInsurance": "Health Insurance",
            "details.401k": "401(k)",
        }
    };
    return createClient(config);
}

