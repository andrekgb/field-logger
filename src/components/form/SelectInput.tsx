import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const SelectInput = React.forwardRef<any, TextFieldProps>((props: TextFieldProps, ref) => {
    return (
        <TextField
            select
            ref={ref}
            {...props}
        >
            {props.children}
        </TextField>
    )
});

export default SelectInput;