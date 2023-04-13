import React from "react";
import { connect } from "react-redux";
import { CellParams } from "./tableModel";
import CircularProgress from "@mui/material/CircularProgress";
import ReduxState from "../state/ReduxState";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";
import { Job, JobSearchClient } from "../models";
import { JobStatus } from "../enums";
import EnumEditCell from "./EnumEditCell"

type InputPropsType = CellParams;

interface MappedPropsType {
    job: Job|undefined;
    client: JobSearchClient|undefined;
    status: JobStatus;
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const id = props.data.id;
    const { client, jobSearch } = state.data;
    const job = jobSearch?.jobs[id];
    return {
        client,
        job,
        status: props.value as JobStatus
    };
}

const EnumCell = EnumEditCell<JobStatus>;

const ComponentFunc: React.FC<MappedPropsType> = ({ client, job, status }) => {
    const [ loading, setLoading ] = React.useState(false);
    if (!(job && client)) return <span>{status}</span>;
    const options = Object.values(JobStatus);
    const onChange = (status: JobStatus) => {
        const newJob: Job = {
            ...job,
            status
        };
        setLoading(true);
        client.saveJob(newJob)
            .then(() => dispatchSavedJob(newJob))
            .finally(() => setLoading(false));
    };
    return loading ? <CircularProgress /> : <EnumCell
        value={status}
        options={options}
        onChange={onChange}
    />
};

export type StatusCellPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
