import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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
                <Button onClick={onCreate} color="warning">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export type NewConfigDialogPropsType = InputPropsType;
export default ComponentFunc;
