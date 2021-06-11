import { OutlinedTextFieldProps } from '@material-ui/core/TextField/TextField'
import { CloseOutlined } from '@material-ui/icons'
import React from 'react'
import { IconButton, InputAdornment, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { set } from 'lodash-es'

const useStyles = makeStyles(({ palette: { divider, action }, spacing }: Theme) => ({
    root: {
        paddingRight: spacing(0.5),
        minHeight: 32,
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
    multline: {
        fontSize: 14,
        fontWeight: 500
    },
    textfield: {
        '& .MuiFormHelperText-root': {
            margin: 0,
            fontSize: 11,
            fontWeight: 500,
            opacity: 0.72
        }
    },
    inputAdornedEnd: {
        paddingRight: 0
    }
}))

export interface StyledTextFieldProps
    extends Omit<OutlinedTextFieldProps, 'variant' | 'value' | 'onChange'> {
    value: string
    onChange: (value: string) => void
    clearable?: boolean
}

const StyledTextField: React.FC<StyledTextFieldProps> = ({
    clearable,
    value,
    onChange,
    ...props
}) => {
    const classes = useStyles()
    const handleClear = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        onChange('')
    }
    const endAdornment = (
        <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
                <CloseOutlined fontSize="small" />
            </IconButton>
        </InputAdornment>
    )
    const changeCb = props.select ? 'onChange' : 'onBlur'
    const changeHandler = set({}, changeCb, (e: any) => onChange(e.target.value))
    return (
        <TextField
            fullWidth
            variant="outlined"
            size="small"
            {...props}
            className={clsx(classes.textfield, props.className)}
            InputProps={{
                endAdornment: clearable && value ? endAdornment : undefined,
                ...props.InputProps,
                classes: {
                    ...props.InputProps?.classes,
                    inputAdornedEnd: clsx(
                        classes.inputAdornedEnd,
                        props.InputProps?.classes?.inputAdornedEnd
                    ),
                    notchedOutline: clsx(
                        classes.notchedOutline,
                        props.InputProps?.classes?.notchedOutline
                    ),
                    root: clsx(classes.root, props.InputProps?.classes?.root),
                    input: clsx(
                        {
                            [classes.input]: !props.multiline,
                            [classes.multline]: props.multiline
                        },
                        props.InputProps?.classes?.input
                    )
                }
            }}
            value={value}
            {...changeHandler}
        />
    )
}

export default StyledTextField
