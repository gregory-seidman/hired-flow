import React from "react";
import { connect } from "react-redux";
import ReduxState from "../state/ReduxState";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ColDef, RowData, RowsProp } from "@material-ui/data-grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import List from "@material-ui/icons/List";
import { Job, JobSearch } from "../models";
import rowBuilder from "./rowBuilder";
import columnBuilder from "./columnBuilder";
import TableGrid, { ColumnButtonDefs } from "./TableGrid";
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
    const [ curJobId, setCurJobId_ ] = React.useState("");
    const [ creatingNew, setCreatingNew ] = React.useState(false);
    const currentJob: Job|undefined = jobs[curJobId];
    const openEdit: boolean = !!(creatingNew || curJobId || (jobsList.length === 0));
    const classes = useStyles();
    const columns: ColDef[] = fieldOrder.map(columnBuilder(fieldNames));
    const rows: RowsProp = jobsList.map(rowBuilder(fieldOrder));
    const setCurJobId = (id: string) => {
        setCurJobId_(id);
        setCreatingNew(false);
    }
    const buttons: ColumnButtonDefs = [
        {
            field: "_lastInteractionDate",
            button: <List />,
            onClick: (row: RowData) => {} //TODO
        },
        {
            field: "_nextInteractionDate",
            button: <AddIcon />,
            onClick: (row: RowData) => {} //TODO
        },
        {
            field: "company",
            button: <Edit />,
            onClick: (row: RowData) => { setCurJobId(row.id.toString())}
        }
    ];
    const closeDialog = () => setCurJobId("");

    return (
        <React.Fragment>
            <div className={classes.gridWrapper}>
                <TableGrid
                    rows={rows}
                    columns={columns}
                    buttons={buttons}
                />
                <Fab
                    onClick={() => setCreatingNew(true)}
                    className={classes.fab}
                    color="primary"
                    aria-label="add"
                >
                    <AddIcon />
                </Fab>
            </div>
            { openEdit ? (
            <EditJobDialog
                job={currentJob}
                open={openEdit}
                disableCancel={!jobsList.length}
                closeDialog={closeDialog}
            />
            ) : null }
        </React.Fragment>
    );
}

export type JobSearchPropsType = InputPropsType;
export default connect(mapStateAndProps)(ComponentFunc);
