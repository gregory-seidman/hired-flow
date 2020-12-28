import React from "react";
import { connect } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CellParams } from "@material-ui/data-grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReduxState from "../state/ReduxState";
import { dispatchSavedJob } from "../state/dispatchers/dataDispatchers";
import { Job, JobSearchClient } from "../models";
import { JobStatus } from "../enums";
import textWidth from "../utils/textWidth";

type InputPropsType = CellParams;

interface MappedPropsType {
    job: Job|undefined;
    client: JobSearchClient|undefined;
    status: JobStatus;
}

const useStyles = makeStyles((theme: Theme) => ({
    statusCell: {
        position: "relative",
        top: "calc(50% - 1ex)",
        transform: "translateY(-50%)",
        height: "2ex",
        "& select": {
            marginTop: "-2ex",
            width: "calc(100% - 1em)"
        }
    }
}));

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

type OnSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
const ComponentFunc: React.FC<MappedPropsType> = ({ client, job, status }) => {
    const [ loading, setLoading ] = React.useState(false);
    const classes = useStyles();
    if (!(job && client)) return <span>{status}</span>;
    const onChange = (evt: OnSelectChangeEvent) => {
        const newJob: Job = {
            ...job,
            status: evt.target.value as JobStatus
        };
        setLoading(true);
        client.saveJob(newJob)
            .then(() => dispatchSavedJob(newJob))
            .finally(() => setLoading(false));
    };
    return loading ? <CircularProgress /> : (
        <div className={classes.statusCell} style={{ width: textWidth(status) }}>
                <span className="hover-hide">{status}</span>
                <select className="hover-show" onChange={onChange} value={status}>
                {Object.values(JobStatus).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>
    );
};

export type StatusCellPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
