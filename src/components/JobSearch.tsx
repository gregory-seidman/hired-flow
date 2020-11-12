import React from "react";
import { connect } from "react-redux";
import ReduxState from "../state/ReduxState";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, ColDef, RowsProp } from "@material-ui/data-grid";
import { Job, JobSearch } from "../models";
import rowBuilder from "./rowBuilder";
import columnBuilder from "./columnBuilder";

interface InputPropsType {
}

interface MappedPropsType {
    configsLoaded: boolean;
    jobSearch: JobSearch;
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
    const { jobSearch, configsLoaded, selectedJobId } = state.data;
    const mappedProps: MappedPropsType = {
        configsLoaded,
        jobSearch: jobSearch!,
        jobs: Object.values(jobSearch!.jobs),
    };
    if (selectedJobId) {
        mappedProps.currentJob = jobSearch!.jobs[selectedJobId];
    }
    return mappedProps;
}

const ComponentFunc: React.FC<MappedPropsType> = ({ configsLoaded: jobsLoaded, jobSearch, jobs, currentJob }) => {
    const { fieldNames, fieldOrder } = jobSearch;
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
