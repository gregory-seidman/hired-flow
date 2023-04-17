import { TextFieldProps } from "@mui/material";

export enum FieldType {
    Nested = "nested",
    Grouped = "grouped",
    GroupedNested = "grouped_nested",
    Custom = "custom",
    StringField = "string",
    //DateField = "date",
    //DateTimeField = "datetime",
}

export interface FieldDef<T> {
    label?: string;
    field: keyof T;
    type: FieldType;
    // only valid if type is Grouped
    groupedFields?: FieldDef<T>[];
    textFieldProps?: TextFieldProps;
}

export interface CustomFieldDef<T, V> extends FieldDef<T> {
    // only valid if type is Custom
    render?: (value: V, onChange: (value: V) => void) => React.ReactElement;
    // only valid if type is Nested or GroupedNested
    nestedFields?: FieldDef<V>[];
}