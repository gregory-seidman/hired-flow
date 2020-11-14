import React from "react";
import { CellParams, Columns, RowModel, RowData, RowsProp } from "@material-ui/data-grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface InputPropsType {
    rows: RowsProp;
    columns: Columns;
}

type MappedPropsType = InputPropsType;

const ComponentFunc: React.FC<MappedPropsType> = ({ rows, columns }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        { columns.map(c => (
                            <TableCell key={c.field}>{c.headerName}</TableCell>
                        )) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows.map((row: RowData) => (
                        <TableRow key={row.id}>
                            { columns.map(c => {
                                let cellValue = row[c.field];
                                if (c.hasOwnProperty("renderCell")) {
                                    const rowModel: RowModel = {
                                        id: row.id,
                                        data: row,
                                        selected: false
                                    };
                                    const params: CellParams = {
                                        value: cellValue,
                                        field: c.field,
                                        getValue: f => row[f],
                                        data: row,
                                        rowModel,
                                        colDef: c,
                                        api: null
                                    };
                                    cellValue = c.renderCell!(params);
                                }
                                return (
                                    <TableCell key={`${row.id}:${c.field}`}>{cellValue}</TableCell>
                                );
                            }) }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export type TableGridPropsType = InputPropsType;
export default ComponentFunc;
