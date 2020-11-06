import React from "react";
import { connect } from "react-redux";
import ReduxState from "../state/ReduxState";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, ColDef, RowData, RowsProp, CellParams, CellValue } from "@material-ui/data-grid";
import { JobStatus } from "../enums";
import { Job, JobSearchClient, Contact, Interaction } from "../models";

interface InputPropsType {
}

interface MappedPropsType {
    jobsLoaded: boolean;
    config: JobSearchClient;
    jobs: Job[];
    currentJob?: Job;
}

const useStyles = makeStyles((theme: Theme) => ({
    gridWrapper: {
        height: "calc(100vh - 25ex)",
        minHeight: "calc(100vh - 25ex)",
        overflowX: "scroll"
    }
}));

// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function textWidth(text: string) {
    const div = document.createElement("div");
    div.className = "MuiDataGrid-root MuiDataGrid-colCell";
    div.style.whiteSpace = "no-wrap";
    div.style.left = "-1000px";
    div.style.top = "-1000px";
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.innerText = "XXXX" + text;
    document.body.appendChild(div);
    const width = div.clientWidth;
    document.body.removeChild(div);
    return width;
}

type JobFieldExtractor = (job: Job) => CellValue;

function makeSimpleExtractor(field: keyof Job): JobFieldExtractor {
    return (job: Job) => job[field];
}

function makeDetailsExtractor(field: string): JobFieldExtractor {
    const subfield: string = field.replace("details.", "");
    return (job: Job) => job.details[subfield];
}

const ContactCell: React.FC<Contact> =
    ({ name, email, phone, recruitingAgency }) => (
        <React.Fragment>
            <div>{name}</div>
            {recruitingAgency && <div>{recruitingAgency}</div>}
            {email && <div><a href={"mailto:" + email}>{email}</a></div>}
            {phone && <div><a href={"tel:" + phone.replace(/[^0-9a-zA-Z]/g, "")}>{phone}</a></div>}
        </React.Fragment>
);

const endOfTime: Date = new Date(9999, 12);
const startOfTime: Date = new Date(0, 1);

function justYesterday(): Date {
    const now: Date = new Date();
    const pastMidnight: number = (
        now.getMilliseconds() + 1000 * (
            now.getSeconds() + 60 * (
                now.getMinutes() + 60 * (
                    now.getHours()
                )
            )
        )
    );
    return new Date(now.valueOf() - (pastMidnight + 1));
}

function getLastInteraction(interactions: Interaction[]): Date|null {
    const guard: Date = startOfTime;
    const now: Date = justYesterday();
    const mostRecent: Date = interactions.reduce(
        (latest,interaction) => {
            const { date } = interaction;
            return (date > now) ? latest : (
                (date > latest) ? date : latest
            );
        },
        guard
    );
    return (mostRecent === guard) ? null : mostRecent;
}

function getNextInteraction(interactions: Interaction[]): Date|null {
    const guard: Date = endOfTime;
    const now: Date = justYesterday();
    const immediateNext: Date = interactions.reduce(
        (nearest,interaction) => {
            const { date } = interaction;
            return (date < now) ? nearest : (
                (date < nearest) ? date : nearest
            );
        },
        guard
    );
    return (immediateNext === guard) ? null : immediateNext;
}

interface JobFieldMapper {
    field: string;
    extractor: JobFieldExtractor;
}

const syntheticFieldExtractors: { [fieldName: string]: JobFieldExtractor } = {
    "_lastInteractionDate": (job: Job) =>
        getLastInteraction(job.interactions),
    "_nextInteractionDate": (job: Job) =>
        getNextInteraction(job.interactions),
    "status": (job: Job) => {
        const { status, eliminatedReason } = job;
        return (status === JobStatus.Eliminated) ?
            `${status}: ${eliminatedReason}` :
            status;
    }
};

const columnDefs: { [fieldName: string]: ColDef } = {
    "company": {
        field: "company",
        headerName: "Company",
        sortable: true
    },
    "jobTitle": {
        field: "jobTitle",
        headerName: "Position",
        sortable: true
    },
    "notes": {
        field: "notes",
        headerName: "Notes",
        sortable: true
    },
    "contact": {
        field: "contact",
        headerName: "Point of Contact",
        sortable: false,
        renderCell: (params: CellParams) =>
            <ContactCell {...(params.getValue("contact") as Contact)} />
    },
    "status": {
        field: "status",
        headerName: "Status",
        sortable: true
    },
    "_lastInteractionDate": {
        field: "_lastInteractionDate",
        headerName: "Last Contact",
        sortable: true,
        type: "date"
    },
    "_nextInteractionDate": {
        field: "_nextInteractionDate",
        headerName: "Expected Contact",
        sortable: true,
        type: "date"
    }
};

function getFieldExtractor(field: string): JobFieldExtractor {
    if (syntheticFieldExtractors.hasOwnProperty(field)) {
        return syntheticFieldExtractors[field];
    }
    if (field.startsWith("details.")) {
        return makeDetailsExtractor(field);
    }
    if (columnDefs.hasOwnProperty(field)) {
        return makeSimpleExtractor(field as keyof Job);
    }
    throw new Error(`Unknown field: ${field}`);
}

function rowBuilder(fieldOrder: string[]): (job: Job) => RowData {
    const mappers: JobFieldMapper[] = fieldOrder.map(field => ({
        field,
        extractor: getFieldExtractor(field)
    }));
    return (job: Job) => mappers.reduce(
        (row: RowData, mapper: JobFieldMapper) => {
            row[mapper.field] = mapper.extractor(job);
            return row;
        },
        { id: job.id }
    );
}

type ColumnMapper = (field: string) => ColDef;
function columnBuilder(fieldNames: { [field: string]: string }): ColumnMapper {
    return (field: string) => {
        const colDef: ColDef = columnDefs[field] || {
            field,
            sortable: true
        };
        if (fieldNames[field]) {
            colDef.headerName = fieldNames[field];
        } else if (!colDef.headerName) {
            colDef.headerName = field.replace(/^details\./, "");
        }
        colDef.description = colDef.headerName;
        colDef.width = textWidth(colDef.headerName);
        return colDef;
    };
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const { configs, configIndex, jobs, jobIndex, jobsLoaded } = state.data;
    const mappedProps: MappedPropsType = {
        jobsLoaded,
        config: configs[configIndex!],
        jobs: jobs,
    };
    if (state.data.hasOwnProperty("jobIndex") && (jobIndex! > 0)) {
        mappedProps.currentJob = jobs[jobIndex!];
    }
    return mappedProps;
}

const ComponentFunc: React.FC<MappedPropsType> = ({ jobsLoaded, config, jobs, currentJob }) => {
    const { fieldNames, fieldOrder } = config.config;
    const classes = useStyles();
    const columns: ColDef[] = fieldOrder.map(columnBuilder(fieldNames));
    const rows: RowsProp = jobs.map(rowBuilder(fieldOrder));
    return (
        <React.Fragment>
            <div className={classes.gridWrapper}>
                <DataGrid
                    rows={rows}
                    loading={!jobsLoaded}
                    columns={columns}
                />
            </div>
        </React.Fragment>
    );
}

export type JobSearchPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
