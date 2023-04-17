import React from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReduxState from "../state/ReduxState";
import { Job, JobSearchClient } from "../models";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";
import FormFragment from "./generic/FormFragment";
import { CustomFieldDef, FieldDef, FieldType } from "./generic/formModel";
import { columnDefs } from "./columnBuilder";

interface InputPropsType {
    closeDialog?: () => void;
    disableCancel?: boolean;
    open: boolean;
    job?: Job|undefined|null;
}

type DetailsType = Job['details'];
type ContactType = Job['contact'];

interface MappedPropsType {
    closeDialog?: () => void;
    disableCancel: boolean;
    open: boolean;
    job: Job;
    client: JobSearchClient;
    fields: FieldDef<Job>[];
    detailsFields: FieldDef<DetailsType>[];
}

const contactFields: FieldDef<ContactType>[] = [
    {
        label: "Name",
        field: "name",
        type: FieldType.StringField
    }, {
        label: "Email",
        field: "email",
        type: FieldType.StringField
    }, {
        label: "Phone",
        field: "phone",
        type: FieldType.StringField
    }, {
        label: "Recruiting Agency",
        field: "recruitingAgency",
        type: FieldType.StringField
    }
];
const contactField: CustomFieldDef<Job, ContactType> = {
    field: "contact",
    label: "Point of Contact",
    type: FieldType.GroupedNested,
    nestedFields: contactFields
}

type JobFieldDefMap = { [Field in keyof Job]?: FieldDef<Job> };

const jobFields: JobFieldDefMap = {
    ...(Object.entries(columnDefs).reduce((map, [field, def]) => {
        if (def.renderCell || field.startsWith("_")) return map;
        const key = field as keyof Job;
        map[key] = {
            field: key,
            label: def.headerName,
            type: def.type as FieldType || FieldType.StringField
        };
        return map;
    }, {} as JobFieldDefMap)),
    details: {
        field: "details",
        type: FieldType.Nested
    },
    contact: contactField
}

const JobForm = FormFragment<Job>;

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { client, jobSearch } = state.data;
    const { fieldNames, fieldOrder } = jobSearch!;
    const { closeDialog, disableCancel, open, job } = props;
    const visibleDetailFields = fieldOrder
        .filter((fieldName) => fieldName.startsWith("details."))
        .reduce(
            (byName, name, i) => {
                byName[name.substring(8)] = i;
                return byName;
            }, ({} as { [fieldName: string]: number })
        );
    const detailsFields: FieldDef<DetailsType>[] = Object.entries(fieldNames)
        .filter(([ fieldName, label ]) => fieldName.startsWith("details."))
        .map(([ fieldName, label ]) => ({
            label,
            type: FieldType.StringField,
            field: fieldName.substring(8)
        }));
    detailsFields.sort((a, b) => {
        const aName = a.field;
        const bName = b.field;
        const aVisible = visibleDetailFields.hasOwnProperty(aName);
        const bVisible = visibleDetailFields.hasOwnProperty(bName);
        if (aVisible === bVisible) {
            return aName.toString().localeCompare(bName.toString());
        }
        return aVisible ? -1 : 1;
    });
    let addedDetails = false;
    const fields = fieldOrder
        .map(f => {
            const def = jobFields[f as keyof Job];
            if (def) return def;
            if (f.startsWith("details.") && !addedDetails) {
                addedDetails = true;
                const detailsField = {
                    ...(jobFields["details"]),
                    nestedFields: detailsFields
                } as CustomFieldDef<Job, DetailsType>;
                return detailsField;
            }
            return null;
        })
        .filter(f => !!f)
        .map(f => f!);
    fields.push({
        field: "notes",
        label: "Notes",
        type: FieldType.StringField,
        textFieldProps: {
            multiline: true,
            minRows: 4,
            maxRows: 1000
        }
    })
    return {
        closeDialog,
        disableCancel: !!disableCancel,
        open,
        job: job || client!.newJob(),
        client: client!,
        fields,
        detailsFields
    };
}

const ComponentFunc: React.FC<MappedPropsType> = ({ closeDialog, disableCancel, open, job, client, fields }) => {
    const onClose = closeDialog ?
        () => closeDialog() :
        () => {};
    const [saveJob, setJob] = React.useState(job);
    const onSave = () => {
        client.saveJob(saveJob)
            .then(() => dispatchSavedJob(saveJob));
        onClose();
    };
    return (
        <Dialog open={open} onClose={disableCancel ? undefined : onClose}>
            <DialogTitle>{job.id ? "Edit" : "New"} Job (all fields optional)</DialogTitle>
            <DialogContent>
                <JobForm model={saveJob} fields={fields} onChange={setJob} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={disableCancel} color="primary">
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
