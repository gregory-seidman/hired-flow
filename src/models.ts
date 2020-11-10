import { JobStatus, InteractionStatus, EliminatedReason } from "./enums";
import { Datestamp } from "./utils/Datestamp";

export interface JobSearchIdentifier {
    id: string;
    name: string;
    createdAt: Datestamp;
}

export type NamedFields = { [field: string]: string };
export type JobsById = { [id: string]: Job }
export type InteractionsById = { [id: string]: Interaction }

export interface JobSearchRecord extends JobSearchIdentifier {
    fieldNames: NamedFields;
    fieldOrder: string[];
}

export interface JobSearch extends JobSearchRecord {
    jobs: JobsById;
}

export interface JobSearchClient {
    loadJobSearch: () => Promise<JobSearch>;
    saveConfig: (jobSearch: JobSearch) => Promise<void>;
    saveJob: (job: Job) => Promise<void>;
    saveInteraction:
        (job: JobIdentifier, interaction: Interaction) => Promise<void>;
    newJob: () => Job;
    newInteraction:
        (job: Job, date: Datestamp, description?: string) => Interaction;
}

export interface InteractionIdentifier {
    id: string;
    jobId: string;
}

export interface Interaction extends InteractionIdentifier {
    description: string;
    date: Datestamp;
    status: InteractionStatus;
    notes?: string;
}

export interface Contact {
    name: string;
    email?: string;
    phone?: string;
    recruitingAgency?: string;
}

export interface JobIdentifier {
    id: string;
    jobSearchId: string;
}

export interface JobRecord extends JobIdentifier {
    company: string;
    jobTitle: string;
    status: JobStatus;
    eliminatedReason?: EliminatedReason;
    contact: Contact;
    details: { [field: string]: string };
    notes?: string;
}

export interface Job extends JobRecord {
    interactions: InteractionsById;
}
