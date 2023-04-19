import React from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReduxState from "../state/ReduxState";
import { Interaction, Job, JobSearchClient } from "../models";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";
import FormFragment from "./generic/FormFragment";
import { EnumFieldDef, FieldDef, FieldType } from "./generic/formModel";
import { InteractionStatus } from "../enums";
import { today } from "../utils/Datestamp";

interface InputPropsType {
    closeDialog?: () => void;
    open: boolean;
    job: Job;
    interaction?: Interaction|undefined|null;
}

interface MappedPropsType {
    closeDialog?: () => void;
    open: boolean;
    job: Job;
    client: JobSearchClient;
    interaction: Interaction;
    fields: FieldDef<Interaction>[];
}

const statusField: EnumFieldDef<Interaction, InteractionStatus> = {
    field: "status",
    label: "Interaction Status",
    type: FieldType.EnumField,
    enumValues: InteractionStatus
}
const interactionFields: FieldDef<Interaction>[] = [
    {
        field: "description",
        label: "Description",
        type: FieldType.StringField
    },
    {
        field: "date",
        label: "Date of Interaction",
        type: FieldType.DateField
    },
    statusField,
    {
        field: "notes",
        label: "Notes",
        type: FieldType.StringField,
        textFieldProps: {
            multiline: true,
            minRows: 4,
            maxRows: 1000
        }
    }
];

const InteractionForm = FormFragment<Interaction>;

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { client } = state.data;
    const { closeDialog, open, job, interaction } = props;
    return {
        closeDialog,
        open,
        job,
        interaction: interaction || client!.newInteraction(job, today()),
        client: client!,
        fields: interactionFields,
    };
}

async function save(client: JobSearchClient, job: Job, saveInteraction: Interaction) {
    const isNewInteraction = !saveInteraction.id;
    await client.saveInteraction(job, saveInteraction);
    if (isNewInteraction) {
        const saveJob: Job = {
            ...job,
            interactions: {
                ...job.interactions,
                [saveInteraction.id]: saveInteraction
            }
        }
        await client.saveJob(saveJob);
        job = saveJob;
    }
    dispatchSavedJob(job);
}

const ComponentFunc: React.FC<MappedPropsType> = ({ closeDialog, open, job, interaction, client, fields }) => {
    const onClose = closeDialog ?
        () => closeDialog() :
        () => {};
    const [saveInteraction, setInteraction] = React.useState(interaction);
    const onSave = () => {
        save(client, job, saveInteraction);
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{interaction.id ? "Edit" : "New"} Interaction (all fields optional)</DialogTitle>
            <DialogContent>
                <InteractionForm model={saveInteraction} fields={fields} onChange={setInteraction} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="warning">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export type EditInteractionDialogPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
