import React from "react";
import { CellParams, Columns, ColDef, RowModel, RowData, RowsProp } from "@material-ui/data-grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import orderBy, { Comparator, ItemKey } from "../utils/orderBy";

export interface ColumnButtonDef {
    field: string;
    context?: unknown;
    onClick: ((row: RowData, context: unknown) => void) | ((row: RowData) => void);
    button: React.ReactNode;
}
export type ColumnButtonDefs = ColumnButtonDef[];

interface InputPropsType {
    rows: RowsProp;
    columns: Columns;
    buttons?: ColumnButtonDefs;
}

type MappedPropsType = InputPropsType;

const useStyles = makeStyles((theme: Theme) => ({
    hoverParent: {
        "& td": {
            position: "relative"
        },
        "& .hover-show": {
            display: "none",
            textAlign: "center",
            position: "absolute",
            width: "100%",
            top: "16px",
            left: 0
        },
        "&:hover": {
            "& .hover-show": {
                opacity: 1,
                display: "block"
            },
            "& .hover-hide": {
                display: "none"
            },
            "& .hover-fade": {
                opacity: 0.4
            }
        }
    },
    sortableHeader: {
        cursor: "pointer"
    },
    sortOrder: {
        backgroundColor: theme.palette.grey[500],
        borderRadius: "5px"
    }
}));

type ClickEvent = React.MouseEvent<HTMLTableDataCellElement, MouseEvent>;
type ClickHandler = (evt: ClickEvent) => void;

function makeOnClickHeader(
    column: ColDef,
    sortColumns: SortColumns,
    setSortColumns: (value: SortColumns) => void
): ClickHandler {
    const index = sortColumns.findIndex(({ field }) => (field === column.field));
    if (index < 0) {
        return (evt: ClickEvent) => {
            if (evt.ctrlKey || evt.shiftKey || evt.metaKey) {
                setSortColumns([ ...sortColumns, { field: column.field } ]);
            } else {
                setSortColumns([ { field: column.field } ]);
            }
        };
    }
    const { descending } = sortColumns[index];
    return descending ?
        (evt: ClickEvent) => {
            const newSort = [...sortColumns];
            newSort.splice(index, 1);
            setSortColumns(newSort);
        } :
        (evt: ClickEvent) => {
            const newSort = [...sortColumns];
            newSort[index] = {
                field: column.field,
                descending: true
            };
            setSortColumns(newSort);
        };
}

interface SortOrder {
    field: string;
    descending?: boolean;
}
type SortColumns = SortOrder[];

interface ColumnProps {
    column: ColDef;
    sortColumns: SortColumns;
    setSortColumns: (value: SortColumns) => void;
}

const ColumnHeader: React.FC<ColumnProps> = ({ column, sortColumns, setSortColumns }) => {
    const classes = useStyles();
    if (!column.sortable) {
        return <TableCell>{column.headerName}</TableCell>;
    }
    const index = sortColumns.findIndex(({ field }) =>
                                        (field === column.field));
    const onClick = makeOnClickHeader(column, sortColumns, setSortColumns);
    return (
        <TableCell className={classes.sortableHeader} onClick={onClick}>
            {column.headerName} {(index >= 0) && (
                <React.Fragment>
                    {sortColumns[index].descending ? "▼" : "▲"}
                    <span className={classes.sortOrder}>
                        {index + 1}
                    </span>
                </React.Fragment>
            )}
        </TableCell>
    );
}

function sortBy(rows: RowsProp, sortColumns: SortColumns): RowsProp {
    if (!sortColumns.length) return rows;
    const compare: Comparator<string[]> = (a: string[], b: string[]) => {
        const len = a.length;
        for (let i=0; i<len; ++i) {
            const cmp = a[i].localeCompare(b[i]);
            if (cmp !== 0) {
                return sortColumns[i].descending ? -cmp : cmp;
            }
        }
        return 0;
    };
    const itemKey: ItemKey<RowData, string[]> =
        (row: RowData) => sortColumns.map(c => (row[c.field] as string));
    return orderBy(rows, itemKey, compare);
}

const ColumnButton: React.FC<{row: RowData, def: ColumnButtonDef}> =
    ({ row, def }) =>
        <span onClick={() => def.onClick(row, def.context)}>{def.button}</span>;

type CellParamsPlusButtons = CellParams & {
    buttons?: ColumnButtonDef[] | undefined;
}

const BasicCellContent: React.FC<CellParamsPlusButtons> = ({ value, data, buttons }) => (
    <React.Fragment>
        <span className="hover-fade">{
            value
        }</span><span className="hover-show">{
            buttons?.map((def, i) =>
                <ColumnButton key={i} row={data} def={def} />)
        }</span>
    </React.Fragment>
);

const ComponentFunc: React.FC<MappedPropsType> = ({ rows, columns, buttons }) => {
    const classes = useStyles();
    const [ sortColumns, setSortColumns ] = React.useState<SortColumns>([]);
    const sortedRows = sortBy(rows, sortColumns);
    const columnButtons = buttons?.reduce(
        (map: { [key: string]: ColumnButtonDef[] }, def: ColumnButtonDef) => {
            if (!map.hasOwnProperty(def.field)) {
                map[def.field] = [];
            }
            map[def.field].push(def);
            return map;
        },
        {}
        ) ?? {};

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        { columns.map(c => (
                            <ColumnHeader
                                key={c.field}
                                column={c}
                                sortColumns={sortColumns}
                                setSortColumns={setSortColumns}
                            />
                        )) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { sortedRows.map((row: RowData) => (
                        <TableRow key={row.id} className={classes.hoverParent}>
                            { columns.map(c => {
                                const rowModel: RowModel = {
                                    id: row.id,
                                    data: row,
                                    selected: false
                                };
                                const params: CellParamsPlusButtons = {
                                    value: row[c.field],
                                    field: c.field,
                                    getValue: f => row[f],
                                    data: row,
                                    rowModel,
                                    colDef: c,
                                    api: null,
                                    buttons: columnButtons[c.field]
                                };
                                const cellValue = (c.renderCell || BasicCellContent)(params);
                                return (
                                    <TableCell key={c.field}>{cellValue}</TableCell>
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
