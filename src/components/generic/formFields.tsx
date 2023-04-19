import React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { CustomFieldDef, EnumFieldDef, FieldDef, FieldType } from "./formModel";
import { AnyEnum } from "../../enums";
import FieldSet from "./FieldSet";
import FormFragment from "./FormFragment";

function onChangeForField<T, V>(field: keyof T, model: T, onChange: (newModel: T) => void): (value: V) => void {
    return (value: any) => {
        const newModel = {
            ...model,
            [field]: value
        };
        onChange(newModel);
    }
}

interface RenderFieldProps<T> {
    model: T;
    field: FieldDef<T>;
    onChange: (newModel: T) => void;
}
type RenderField<T> = React.FC<RenderFieldProps<T>>;

function renderNested<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const value = model[field.field];
    type V = typeof value;
    const onChangeField = onChangeForField<T, V>(field.field, model, onChange);
    const Form = FormFragment<V>;
    const custom = field as CustomFieldDef<T, V>;
    return <Form
        model={value}
        fields={custom.nestedFields!}
        onChange={onChangeField}
        />
    ;
}

function renderGrouped<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const Form = FormFragment<T>;
    return (
        <FieldSet>
            { field.label && <FormControl component="legend">{field.label}</FormControl> }
            <Form model={model} fields={field.groupedFields!} onChange={onChange} />
        </FieldSet>
    );
}

function renderGroupedNested<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const value = model[field.field];
    type V = typeof value;
    const onChangeField = onChangeForField<T, V>(field.field, model, onChange);
    const Form = FormFragment<V>;
    const custom = field as CustomFieldDef<T, V>;
    return (
        <FieldSet>
            { field.label && <FormControl component="legend">{field.label}</FormControl> }
            <Form
                model={value}
                fields={custom.nestedFields!}
                onChange={onChangeField}
                />
        </FieldSet>
    );
}

function renderCustom<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const value = model[field.field];
    type V = typeof value;
    const onChangeField = onChangeForField<T, V>(field.field, model, onChange);
    const custom = field as CustomFieldDef<T, V>;
    return custom.render!(value, onChangeField);
}

function renderString<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const value = model[field.field];
    type V = string;
    const onChangeField = onChangeForField<T, V>(field.field, model, onChange);
    return (
        <TextField
            margin="dense"
            fullWidth
            label={field.label}
            {...field.textFieldProps}
            onChange={evt => onChangeField(evt.target.value)}
            value={value}
        />
    );
}

function renderEnum<T>(props: RenderFieldProps<T>): React.ReactElement {
    const { model, field, onChange } = props;
    const value = model[field.field];
    type V = typeof value;
    const onChangeField = onChangeForField<T, V>(field.field, model, onChange);
    type EnumType = V extends AnyEnum ? V : AnyEnum;
    const enumDef = field as EnumFieldDef<T, EnumType>;
    return (
        <FormControl fullWidth>
            <Select
                onChange={evt => onChangeField(evt.target.value as V)}
                label={field.label}
                value={value as string}>
            { Object.entries(enumDef.enumValues).map((entry) => {
                const k = entry[0] as EnumType;
                const v = entry[1] as string;
                return <MenuItem key={k} value={k}>{v}</MenuItem >
            })}
            </Select>
        </FormControl>
    );
}

const fieldsByType: {[key in FieldType]: RenderField<any>} = {
    [FieldType.Nested]: renderNested<any>,
    [FieldType.Grouped]: renderGrouped<any>,
    [FieldType.GroupedNested]: renderGroupedNested<any>,
    [FieldType.Custom]: renderCustom<any>,
    [FieldType.StringField]: renderString<any>,
    [FieldType.EnumField]: renderEnum<any>,
    //[FieldType.DateField]: renderDate<any>,
    //[FieldType.DateTimeField]: renderDateTime<any>,
}

export type FormField<T> = RenderField<T>;
export default fieldsByType;
export const NestedField = renderNested;
export const GroupedField = renderGrouped;
export const GroupedNestedField = renderGroupedNested;
export const CustomField = renderCustom;
export const StringField = renderString;
export const EnumField = renderEnum;
//export const DateField = renderDate;
//export const DateTimeField = renderDateTime;