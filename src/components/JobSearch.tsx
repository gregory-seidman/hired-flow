import React from "react";
import { connect } from "react-redux";
import ReduxState from "../state/ReduxState";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, ColDef, RowsProp } from "@material-ui/data-grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Job, JobSearch } from "../models";
import rowBuilder from "./rowBuilder";
import columnBuilder from "./columnBuilder";
import EditJobDialog from "./EditJobDialog";

interface InputPropsType {
}

interface MappedPropsType {
    jobSearch: JobSearch;
}

const useStyles = makeStyles((theme: Theme) => ({
    gridWrapper: {
        height: "calc(100vh - 25ex)",
        minHeight: "calc(100vh - 25ex)",
        overflowX: "scroll"
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
}));

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const mappedProps: MappedPropsType = {
        jobSearch: state.data.jobSearch!
    };
    return mappedProps;
}

const ComponentFunc: React.FC<MappedPropsType> = ({ jobSearch }) => {
    const { fieldNames, fieldOrder, jobs } = jobSearch;
    const jobsList: Job[] = Object.values(jobs);
    const [ curJobId, setCurJobId ] = React.useState("");
    const currentJob: Job|undefined = jobs[curJobId];
    const open: boolean = !!(curJobId || (jobsList.length === 0));
    const classes = useStyles();
    const columns: ColDef[] = fieldOrder.map(columnBuilder(fieldNames));
    const rows: RowsProp = jobsList.map(rowBuilder(fieldOrder));
    const closeDialog = () => setCurJobId("");
    return (
        <React.Fragment>
            <div className={classes.gridWrapper}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                />
                <Fab
                    onClick={() => setCurJobId("      ")}
                    className={classes.fab}
                    color="primary"
                    aria-label="add"
                >
                    <AddIcon />
                </Fab>
            </div>
            <EditJobDialog
                job={currentJob}
                open={open}
                disableCancel={!jobsList.length}
                closeDialog={closeDialog}
            />
        </React.Fragment>
    );
}

export type JobSearchPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
