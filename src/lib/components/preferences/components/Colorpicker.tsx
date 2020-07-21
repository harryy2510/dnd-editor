import { nanoid } from 'nanoid'
import React from 'react'
import { InputAdornment, Theme, Popover } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Input from './Input'
import { SketchPicker, SketchPickerProps } from 'react-color'
import { bindPopover, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'

const useStyles = makeStyles(({ spacing, palette: { divider } }: Theme) => ({
    inputRoot: {
        paddingLeft: spacing(1)
    },
    inputAdornedStart: {
        paddingLeft: 0
    },
    icon: {
        border: `1px solid ${divider}`,
        width: spacing(2.25),
        height: spacing(2.25),
        borderRadius: '50%'
    }
}))

export interface ColorpickerProps extends Omit<SketchPickerProps, 'value' | 'onChange'> {
    label?: React.ReactNode
    value: string
    onChange: (value: string) => void
}

const Colorpicker: React.FC<ColorpickerProps> = ({ label, value, onChange, ...props }) => {
    const popupState = usePopupState({
        popupId: nanoid(),
        variant: 'popover'
    })
    const classes = useStyles()
    const startAdornment = (
        <InputAdornment position="start">
            <span className={classes.icon} style={{ backgroundColor: value }} />
        </InputAdornment>
    )
    const colorPicker = (
        <Popover {...bindPopover(popupState)}>
            <SketchPicker
                disableAlpha
                styles={{ default: { picker: { boxShadow: 'none' } } }}
                {...props}
                color={value}
                onChange={(e) => onChange(e.hex)}
            />
        </Popover>
    )
    return (
        <>
            <Input
                label={label}
                InputProps={{
                    readOnly: true,
                    startAdornment,
                    classes: {
                        root: classes.inputRoot,
                        inputAdornedStart: classes.inputAdornedStart
                    }
                }}
                value={value}
                {...bindTrigger(popupState)}
            />
            {colorPicker}
        </>
    )
}

export default Colorpicker
