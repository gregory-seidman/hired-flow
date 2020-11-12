import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { dispatchCreatedConfig } from "../state/dispatchers/dataDispatchers";
import { createJobSearch, saveJobSearch } from "../persist";

interface InputPropsType {
    closeDialog?: () => void;
    open: boolean;
}

type MappedPropsType = InputPropsType;

const ComponentFunc: React.FC<MappedPropsType> = ({ closeDialog, open }) => {
    const onClose = closeDialog ?
        undefined : () => closeDialog;
    const [name, setName] = React.useState("");
    const onCreate = () => {
        const jobSearch = createJobSearch(name);
        saveJobSearch(jobSearch)
            .then(() => dispatchCreatedConfig(jobSearch));
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>New Job Search</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    onChange={evt => setName(evt.target.value)}
                    onKeyPress={evt => { if (evt.key === "Enter") onCreate() } }
                    margin="dense"
                    label="Job Search Name"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={!closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={onCreate} color="default">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export type NewConfigDialogPropsType = InputPropsType;
export default ComponentFunc;
