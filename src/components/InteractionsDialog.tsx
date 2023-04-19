import React from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReduxState from "../state/ReduxState";
import { Interaction, Job, JobSearchClient } from "../models";
import InteractionsTable from "./InteractionsTable";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";

interface InputPropsType {
    open: boolean;
    job?: Job|undefined;
    closeDialog: () => void;
}

interface MappedPropsType {
    open: boolean;
    job?: Job|undefined;
    client: JobSearchClient;
    closeDialog: () => void;
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    return {
        ...props,
        client: state.data.client!
    };
}

const ComponentFunc: React.FC<MappedPropsType> = ({ open, job, client, closeDialog }) => {
    const [ interactions, setInteractions ] = React.useState(job?.interactions || {});
    if (!job) return null;
    const onSave = () => {
        const saveJob: Job = {
            ...job,
            interactions
        };
        client.saveJob(saveJob)
            .then(() => dispatchSavedJob(saveJob));
        closeDialog();
    };
    const onAdd = (interaction: Interaction) => {
        setInteractions({
            ...interactions,
            [interaction.id]: interaction
        })
    };
    const onDelete = (interaction: Interaction) => {
        const newInteractions = { ...interactions };
        delete newInteractions[interaction.id];
        setInteractions(newInteractions);
    };
    const onEdit = (interaction: Interaction) => {
        //TODO
    };
    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Interactions with {job.company || "job"}</DialogTitle>
            <DialogContent>
                <InteractionsTable onClickEdit={onEdit} onClickDelete={onDelete} interactions={Object.values(interactions)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="warning">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export type EditJobDialogPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
