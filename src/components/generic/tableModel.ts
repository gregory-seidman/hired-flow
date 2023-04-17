import React from "react";

// the contents of this file are derived from v4 of @material-ui/data-grid

export type RowId = string | number;
export interface RowData {
    id: RowId;
    [key: string]: any;
}
export interface RowModel {
    id: RowId;
    data: RowData;
    selected: boolean;
}
export type RowsProp = RowData[];
export type Rows = RowModel[];
export type CellValue = any;
/**
 * Object passed as parameter in the column [[ColDef]] cell renderer.
 */
export interface CellParams {
    /**
     * The HTMLElement that triggered the event
     */
    element?: HTMLElement;
    /**
     * The column field of the cell that triggered the event
     */
    field: string;
    /**
     * The cell value.
     */
    value: CellValue;
    /**
     * A function that let you get data from other columns.
     * @param field
     */
    getValue: (field: string) => CellValue;
    /**
     * The full set of data of the row that the current cell belongs to.
     */
    data: RowData;
    /**
     * The row model of the row that the current cell belongs to.
     */
    rowModel: RowModel;
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: any;
    /**
     * The row index of the row that the current cell belongs to.
     */
    rowIndex?: number;
}
/**
 * Object passed as parameter in the column [[ColDef]] header renderer.
 */
export interface ColParams {
    /**
     * The column field of the column that triggered the event
     */
    field: string;
    /**
     * The column of the current header component.
     */
    colDef: any;
    /**
     * The column index of the current header component.
     */
    colIndex: number;
}
export type NativeColTypes = 'string' | 'number' | 'date' | 'dateTime';
export type ColType = NativeColTypes | string;
/**
 * Column Definition interface.
 */
export interface ColDef {
    /**
     * The column identifier. It's used to map with [[RowData]] values.
     */
    field: string;
    /**
     * The title of the column rendered in the column header cell.
     */
    headerName?: string;
    /**
     * The description of the column rendered as tooltip if the column header name is not fully displayed.
     */
    description?: string;
    /**
     * Set the width of the column.
     * @default 100
     */
    width?: number;
    /**
     * If `true`, hide the column.
     * @default false;
     */
    hide?: boolean;
    /**
     * If `true`, the column is sortable.
     * @default true
     */
    sortable?: boolean;
    /**
     * Type allows to merge this object with a default definition [[ColDef]].
     * @default string
     */
    type?: ColType;
    /**
     * Allows to override the component rendered as cell for this column.
     * @param params
     */
    renderCell?: (params: CellParams) => React.ReactElement;
}
export type Columns = ColDef[];
