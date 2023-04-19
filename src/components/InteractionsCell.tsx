import React from "react";
import { connect } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import List from "@mui/icons-material/List";
import { CellParams } from "./generic/tableModel";
import { Interaction, JobSearchClient } from "../models";
import ReduxState from "../state/ReduxState";
import InteractionsTable from "./InteractionsTable";
import formatValue from "./generic/formatValue";
import { Datestamp } from "../utils/Datestamp";

type InputPropsType = CellParams;

interface MappedPropsType {
    client: JobSearchClient;
    value: Datestamp | undefined;
    interactions: Interaction[];
}

type Mapper = (state: ReduxState, props: InputPropsType) => MappedPropsType;

const mapStateAndProps: Mapper = (state, props) => {
    const id = props.data.id;
    const { client, jobSearch } = state.data;
    const job = jobSearch?.jobs[id];
    const interactions = Object.values(job?.interactions || {});
    return {
        value: interactions[0]?.date,
        interactions,
        client: client!
    };
}

const ComponentFunc: React.FC<MappedPropsType> = ({ value, interactions, client }) => {
    const [ loading, setLoading ] = React.useState(false);
    const [ expanded, setExpanded ] = React.useState(false);
    if (!interactions.length) return null;
    return loading ? <CircularProgress /> : (
        <div>
                <span>{formatValue(value)}</span>
                <Button style={{ textAlign: "left", position: "relative" }} className="hover-show" onClick={() => setExpanded(!expanded)}><List /></Button>
                <div style={{ display: expanded ? "block" : "none" }}>
                    <InteractionsTable interactions={interactions} />
                </div>
            </div>
    );
}

export default connect(mapStateAndProps)(ComponentFunc);
export type InteractionsCellPropsType = InputPropsType;