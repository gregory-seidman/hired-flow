import React from "react";
import { connect } from "react-redux";
import ReduxState from "../state/ReduxState";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, ColDef, RowsProp } from "@material-ui/data-grid";
import { Job, JobSearchClient } from "../models";
import rowBuilder from "./rowBuilder";
import columnBuilder from "./columnBuilder";

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
