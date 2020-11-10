import { JobIdentifier, Interaction } from "../models";
import { keyForInteraction, nextInteractionId } from "./keys";

const storage = window.localStorage;

export default async function saveInteraction(
    job: JobIdentifier,
    interaction: Interaction
): Promise<void> {
    if (job.id !== interaction.jobId) {
        throw new Error("Job id mismatch");
    }
    const interactionId = interaction.id || nextInteractionId();
    if (!interaction.id) {
        interaction.id = interactionId;
    }
    const key = keyForInteraction(job, interaction);
    storage[key] = JSON.stringify(interaction);
}

