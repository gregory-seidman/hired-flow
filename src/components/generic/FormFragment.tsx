import React from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import { CustomFieldDef, EnumFieldDef, FieldDef, FieldType } from "./formModel";
import { AnyEnum } from "../../enums";

interface InputPropsType<T> {
    model: T;
    fields: FieldDef<T>[];
    onChange: (model: T) => void;
}

const useStyles = makeStyles()((theme: Theme) => ({
    fieldset: {
        padding: theme.spacing(),
        borderRadius: theme.shape.borderRadius,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderWidth: "1px",
        "&:hover": {
            borderColor: theme.palette.common.black
        }
    }
}))

function ComponentFunc<T>(props: InputPropsType<T>): React.ReactElement {
    const { model, fields, onChange } = props;
    const onChangeField = (field: keyof T, value: any) => {
        const newModel = {
            ...model,
            [field]: value
        };
        onChange(newModel);
    }
    const FormFragment = ComponentFunc<T>;
    const { classes } = useStyles();
    return (
        <>
            {
                fields.map((f, i) => {
                    const value = model[f.field];
                    const custom = f as CustomFieldDef<T, typeof value>;
                    const NestedFormFragment = ComponentFunc<typeof value>;
                    switch (f.type) {
                        case FieldType.Custom:
                            return custom.render!(value,
                                    (v: any) => onChangeField(f.field, v));
                        case FieldType.Nested:
                            return (
                                <NestedFormFragment key={i} model={value} fields={custom.nestedFields!} onChange={v => onChangeField(f.field, v)} />
                            );
                        case FieldType.Grouped:
                            return (
                                <FormControl key={i} component="fieldset" className={classes.fieldset}>
                                    { f.label && <FormControl component="legend">{f.label}</FormControl> }
                                    <FormFragment model={model} fields={f.groupedFields!} onChange={onChange} />
                                </FormControl>
                            );
                        case FieldType.GroupedNested:
                            return (
                                <FormControl key={i} component="fieldset" className={classes.fieldset}>
                                    { f.label && <FormControl component="legend">{f.label}</FormControl> }
                                    <NestedFormFragment model={value} fields={custom.nestedFields!} onChange={v => onChangeField(f.field, v)} />
                                </FormControl>
                            );
                        case FieldType.EnumField:
                            type EnumType = typeof value extends AnyEnum ? typeof value : AnyEnum;
                            const enumDef = f as EnumFieldDef<T, EnumType>;
                            return (
                                <select
                                    onChange={evt => onChangeField(f.field, evt.target.value)}
                                    value={value as string}>
                                { Object.entries(enumDef.enumValues).map((entry) => {
                                    const k = entry[0] as EnumType;
                                    const v = entry[1] as string;
                                    return <option key={k} value={k}>{v}</option>
                                })}
                                </select>
                            );
                        case FieldType.StringField:
                            return (
                                <TextField
                                    margin="dense"
                                    fullWidth
                                    label={f.label}
                                    {...f.textFieldProps}
                                    key={i}
                                    onChange={evt => onChangeField(f.field, evt.target.value)}
                                    value={model[f.field]}
                                />
                            );
                        default:
                            return null;
                    }
                })
            }
        </>
    );
};

export type FormFragmentPropsType<T> = InputPropsType<T>;
export default ComponentFunc;
