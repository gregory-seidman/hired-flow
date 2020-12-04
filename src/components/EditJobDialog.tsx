import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ReduxState from "../state/ReduxState";
import { Job, JobSearchClient } from "../models";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";

interface InputPropsType {
    closeDialog?: () => void;
    disableCancel?: boolean;
    open: boolean;
    job?: Job|undefined|null;
}

interface DetailField {
    fieldName: string;
    detailsProp: string;
    label: string;
}

interface MappedPropsType {
    closeDialog?: () => void;
    disableCancel: boolean;
    open: boolean;
    job: Job;
    client: JobSearchClient;
    detailFields: DetailField[];
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { client, jobSearch } = state.data;
    const { fieldNames, fieldOrder } = jobSearch!;
    const { closeDialog, disableCancel, open, job } = props;
    const visibleFields = fieldOrder.reduce(
        (byName, name, i) => {
            byName[name] = i;
            return byName;
        }, ({} as { [fieldName: string]: number })
    );
    const detailFields = Object.entries(fieldNames)
        .filter(([ fieldName, label ]) => fieldName.startsWith("details."))
        .map(([ fieldName, label ]) => ({
            fieldName,
            label,
            detailsProp: fieldName.substring(8)
        }));
    detailFields.sort((a, b) => {
        const aName = a.fieldName;
        const bName = b.fieldName;
        const aVisible = visibleFields.hasOwnProperty(aName);
        const bVisible = visibleFields.hasOwnProperty(bName);
        if (aVisible === bVisible) {
            return aName.localeCompare(bName);
        }
        return aVisible ? -1 : 1;
    });
    return {
        closeDialog,
        disableCancel: !!disableCancel,
        open,
        job: job || client!.newJob(),
        client: client!,
        detailFields
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    fieldset: {
        padding: theme.spacing(),
        borderRadius: theme.shape.borderRadius,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderWidth: "1px",
        "&:hover": {
            borderColor: theme.palette.common.black
        }
    }
}));

const ComponentFunc: React.FC<MappedPropsType> = ({ closeDialog, disableCancel, open, job, client, detailFields }) => {
    const onClose = closeDialog ?
        () => closeDialog() :
        () => {};
    const [company, setCompany] = React.useState(job.company);
    const [jobTitle, setJobTitle] = React.useState(job.jobTitle);
    const [notes, setNotes] = React.useState(job.notes);
    const [details, setDetails] = React.useState(job.details);
    const [contactName, setContactName] = React.useState(job.contact.name);
    const [contactEmail, setContactEmail] = React.useState(job.contact.email);
    const [contactPhone, setContactPhone] = React.useState(job.contact.phone);
    const [contactAgency, setContactAgency] = React.useState(job.contact.recruitingAgency);
    const setDetail = (fieldName: string, value: string) => setDetails({
        ...details,
        [fieldName]: value
    });
    const onSave = () => {
        const saveJob: Job = {
            ...job,
            company,
            jobTitle,
            contact: {
                ...job.contact,
                name: contactName,
                email: contactEmail,
                phone: contactPhone,
                recruitingAgency: contactAgency
            },
            details,
            notes
        };
        client.saveJob(saveJob)
            .then(() => dispatchSavedJob(saveJob));
        onClose();
    };
    const classes = useStyles();
    return (
        <Dialog open={open} onClose={disableCancel ? undefined : onClose}>
            <DialogTitle>{job.id ? "Edit" : "New"} Job (all fields optional)</DialogTitle>
            <DialogContent>
                <TextField
                    onChange={evt => setCompany(evt.target.value)}
                    margin="dense"
                    label="Company Name"
                    value={company}
                    fullWidth
                />
                <TextField
                    onChange={evt => setJobTitle(evt.target.value)}
                    margin="dense"
                    label="Job Title"
                    value={jobTitle}
                    fullWidth
                />
                <FormControl component="fieldset" className={classes.fieldset}>
                    <FormControl component="legend">Point of Contact</FormControl>
                    <TextField
                        onChange={evt => setContactName(evt.target.value)}
                        margin="dense"
                        label="Name"
                        value={contactName}
                        fullWidth
                    />
                    <TextField
                        onChange={evt => setContactEmail(evt.target.value)}
                        margin="dense"
                        label="Email"
                        value={contactEmail}
                        fullWidth
                    />
                    <TextField
                        onChange={evt => setContactPhone(evt.target.value)}
                        margin="dense"
                        label="Phone"
                        value={contactPhone}
                        fullWidth
                    />
                    <TextField
                        onChange={evt => setContactAgency(evt.target.value)}
                        margin="dense"
                        label="Recruiting Agency"
                        value={contactAgency}
                        fullWidth
                    />
                </FormControl>
                { detailFields.map(({ fieldName, label, detailsProp }) => (
                    <TextField
                        key={fieldName}
                        onChange={evt => setDetail(detailsProp, evt.target.value)}
                        margin="dense"
                        label={label}
                        value={details[detailsProp]||""}
                        fullWidth
                    />
                )) }
                <TextField
                    onChange={evt => setNotes(evt.target.value)}
                    margin="dense"
                    multiline
                    rows={4}
                    rowsMax={1000}
                    label="Notes"
                    value={notes}
                    variant="outlined"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={disableCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="default">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export type EditJobDialogPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
