import React from "react";
import { FieldDef } from "./formModel";
import formFields, { FormField } from "./formFields";

interface InputPropsType<T> {
    model: T;
    fields: FieldDef<T>[];
    onChange: (model: T) => void;
}

function ComponentFunc<T>(props: InputPropsType<T>): React.ReactElement {
    const { model, fields, onChange } = props;
    return (
        <>
            {fields.map((f, i) => {
                const Field: FormField<T> = formFields[f.type];
                return <Field key={i} model={model} field={f} onChange={onChange} />;
            })}
        </>
    );
};

export type FormFragmentPropsType<T> = InputPropsType<T>;
export default ComponentFunc;
