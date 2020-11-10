import { JobSearch } from "../models";
import { today } from "../utils/Datestamp";

export default function createJobSearch(name: string): JobSearch {
    const config: JobSearch = {
        id: "",
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
        },
        jobs: {}
    };
    return config;
}

