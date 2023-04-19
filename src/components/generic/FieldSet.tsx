import React from "react";
import FormControl from "@mui/material/FormControl";
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';

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

type InputPropsType = React.PropsWithChildren<{}>;

const ComponentFunc: React.FC<InputPropsType> = ({children}) => {
    const { classes } = useStyles();
    return <FormControl
        component="fieldset"
        className={classes.fieldset}
        children={children}
        />;
}

export type FieldSetPropsType<T> = InputPropsType;
export default ComponentFunc;