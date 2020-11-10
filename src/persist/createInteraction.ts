import { InteractionStatus } from "../enums";
import { Interaction, JobIdentifier } from "../models";
import { Datestamp, justYesterday } from "../utils/Datestamp";

export default function createInteraction(
    job: JobIdentifier,
    date: Datestamp,
    desc?: string
): Interaction {
    const jobId = job.id;
    if (!jobId) {
        throw new Error("Can't create an interaction for an unsaved job");
    }
    const description: string = desc||"";
    const interaction: Interaction = {
        id: "",
        jobId,
        date,
        description,
        status: (date > justYesterday()) ?
            InteractionStatus.Upcoming : InteractionStatus.Occurred
    };
    return interaction;
}
