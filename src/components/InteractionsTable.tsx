import React from "react";
import { Columns, RowData } from "./generic/tableModel";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import TableGrid, { ColumnButtonDefs } from "./generic/TableGrid";
import { Interaction } from "../models";

interface InputPropsType {
    interactions: Interaction[];
    onClickEdit?: (target: Interaction) => void;
    onClickDelete?: (target: Interaction) => void;
}

type MappedPropsType = InputPropsType;

const columns: Columns = [{
    field: "date",
    headerName: "Date",
    sortable: true
}, {
    field: "description",
    headerName: "Description",
    sortable: true
}, {
    field: "status",
    headerName: "Status",
    sortable: true
}, {
    field: "notes",
    headerName: "Notes"
}];

const ComponentFunc: React.FC<MappedPropsType> = ({ interactions, onClickEdit, onClickDelete }) => {
    const buttons: ColumnButtonDefs = [];
    if (onClickEdit) {
        buttons.push({
            field: "date",
            button: <Edit />,
            onClick: (row: RowData) => onClickEdit(row as Interaction)
        })
    }
    if (onClickDelete) {
        buttons.push({
            field: "date",
            button: <Delete />,
            onClick: (row: RowData) => onClickDelete(row as Interaction)
        })
    }
    return <TableGrid columns={columns} rows={interactions} buttons={buttons} />;
}

export type InteractionsTablePropsType = InputPropsType;
export default ComponentFunc;
