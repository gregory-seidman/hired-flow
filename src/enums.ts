export enum JobStatus {
    Applied = "Applied",
    Screening = "Screening",
    Interviewing = "Interviewing",
    AwaitingOffer = "Awaiting Offer",
    Paused = "Paused",
    Offered = "Offered",
    Eliminated = "Eliminated"
}

export enum EliminatedReason {
    Rejected = "Rejected by employer",
    Ghosted = "Ghosted by contact",
    BadJob = "Undesirable job",
    SeeNotes = "See notes"
}

export enum InteractionStatus {
    Occurred = "Occurred",
    Upcoming = "Upcoming",
    Missed = "Missed",
    Rescheduled = "Rescheduled",
    Cancelled = "Cancelled",
    SeeNotes = "See notes"
}

export enum ActionType {
    JobSelected = "JobSelected",
    JobsLoaded = "JobsLoaded",
    ConfigCreated = "ConfigCreated",
    ConfigSelected = "ConfigSelected",
    ConfigsLoaded = "ConfigsLoaded"
}
