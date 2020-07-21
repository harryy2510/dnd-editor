import { OutlinedTextFieldProps } from '@material-ui/core/TextField/TextField'
import React from 'react'
import { TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(({ palette: { divider, action }, spacing }: Theme) => ({
    root: {
        height: 32,
        '&:hover:not(.Mui-focused) $notchedOutline': {
            borderColor: divider,
            backgroundColor: action.hover
        },
        '&.Mui-focused $notchedOutline': {
            borderWidth: 1
        }
    },
    notchedOutline: {
        borderColor: divider
    },
    input: {
        padding: spacing(0.75, 1),
        fontSize: 14,
        fontWeight: 500
    },
    textfield: {
        '& .MuiFormHelperText-root': {
            margin: 0,
            fontSize: 11,
            fontWeight: 500,
            textAlign: 'center',
            opacity: 0.72
        }
    }
}))

export interface StyledTextFieldProps
    extends Omit<OutlinedTextFieldProps, 'variant' | 'value' | 'onChange'> {
    value: string
    onChange: (value: string) => void
}

const StyledTextField: React.FC<StyledTextFieldProps> = ({ value, onChange, ...props }) => {
    const classes = useStyles()
    return (
        <TextField
            fullWidth
            variant="outlined"
            size="small"
            {...props}
            className={clsx(classes.textfield, props.className)}
            InputProps={{
                ...props.InputProps,
                classes: {
                    ...props.InputProps?.classes,
                    notchedOutline: clsx(
                        classes.notchedOutline,
                        props.InputProps?.classes?.notchedOutline
                    ),
                    root: clsx(classes.root, props.InputProps?.classes?.root),
                    input: clsx(classes.input, props.InputProps?.classes?.input)
                }
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export default StyledTextField
