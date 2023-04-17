import React from "react";
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import { JobStatus, InteractionStatus } from "../../enums";
import textWidth from "../../utils/textWidth";

type SupportedEnums = JobStatus | InteractionStatus;

interface InputPropsType<T> {
    onChange: (newValue: T) => void;
    options: T[];
    value: T;
}

const useStyles = makeStyles()((theme: Theme) => ({
    enumCell: {
        position: "relative",
        top: "calc(50% - 1ex)",
        transform: "translateY(-50%)",
        height: "2ex",
        "& select": {
            marginTop: "-2ex",
            width: "calc(100% - 1em)"
        }
    }
}));

type OnSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
function ComponentFunc<T extends SupportedEnums>(props: InputPropsType<T>): React.ReactElement {
    const [ focused, setFocused ] = React.useState(false);
    const { classes } = useStyles();
    const { onChange, options, value } = props;
    const wrappedOnChange = (evt: OnSelectChangeEvent) => {
        setFocused(false);
        onChange(evt.target.value as T);
    };
    return (
        <div className={classes.enumCell} style={{ width: textWidth(value) }}>
                <span
                    style={focused ? { display: "none" } : {}}
                    className="hover-hide"
                    >{value}</span>
                <select
                    style={focused ? { display: "block" } : {}}
                    className="hover-show"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={wrappedOnChange}
                    value={value}>
                {options.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>
    );
};

export type EnumCellPropsType<T> = InputPropsType<T>;
export default ComponentFunc;
