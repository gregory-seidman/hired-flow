import { TextFieldProps } from "@mui/material";
import { AnyEnum as StringEnums } from "../../enums";

export enum FieldType {
    Nested = "nested",
    Grouped = "grouped",
    GroupedNested = "grouped_nested",
    Custom = "custom",
    StringField = "string",
    EnumField = "enum",
    DateField = "date",
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

export interface EnumFieldDef<T, E extends StringEnums> extends FieldDef<T> {
    enumValues: { [key: string]: E };
}