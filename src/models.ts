import { JobStatus, InteractionStatus, EliminatedReason } from "./enums";

export interface JobSearchConfig {
    id?: string;
    name: string;
    createdAt: string;
    fieldNames: { [field: string]: string };
    fieldOrder: string[];
}

export interface JobSearchClient {
    config: JobSearchConfig;
    saveConfig: () => Promise<void>;
    loadJobs: () => Promise<Job[]>;
    saveJob: (job: Job) => Promise<void>;
}

export interface Interaction {
    id?: string;
    description: string;
    date: Date;
    status: InteractionStatus;
    notes?: string;
}

export interface Contact {
    name: string;
    email?: string;
    phone?: string;
    recruitingAgency?: string;
}

export interface Job {
    id: string;
    company: string;
    jobTitle: string;
    status: JobStatus;
    eliminatedReason?: EliminatedReason;
    contact: Contact;
    interactions: Interaction[];
    details: { [field: string]: string };
    notes?: string;
}
