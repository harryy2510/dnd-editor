import { SvgIconProps, Theme } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { ToggleButtonGroupProps } from '@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles(
    ({ palette: { primary, divider, action }, spacing, shape: { borderRadius } }: Theme) => ({
        root: {
            height: 32,
            flex: 1,
            padding: spacing(0.75, 1),
            borderRadius: `${borderRadius}px !important`,
            fontSize: 12,
            textTransform: 'none',
            fontWeight: 500,
            '&:not(:last-child)': {
                marginRight: spacing(1)
            },
            '&:not(:first-child)': {
                marginLeft: 0,
                borderLeftColor: divider
            },
            '&:hover': {
                backgroundColor: action.hover
            }
        },
        selected: {
            '&.Mui-selected': {
                borderColor: `${primary.main}!important`,
                color: primary.main,
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: action.hover
                }
            }
        },
        container: {
            display: 'flex'
        },
        icon: {
            fontSize: 24
        }
    })
)

export type ToggleButtonOption = {
    icon?: React.ComponentType<SvgIconProps>
    label?: React.ReactNode
    id: string | number
}

export interface StyledToggleButtonsProps
    extends Omit<ToggleButtonGroupProps, 'value' | 'onChange'> {
    options: ToggleButtonOption[]
    value: string
    onChange: (value: string) => void
}

const StyledToggleButtons: React.FC<StyledToggleButtonsProps> = ({
    options = [],
    value,
    onChange,
    ...props
}) => {
    const classes = useStyles()
    const children = React.useMemo(() => {
        return options?.map((option, i) => {
            return (
                <ToggleButton
                    key={i}
                    value={option.id}
                    classes={{ root: classes.root, selected: classes.selected }}
                >
                    {option.label}
                    {option.icon && <option.icon className={classes.icon} color="inherit" />}
                </ToggleButton>
            )
        })
    }, [options])
    return (
        <ToggleButtonGroup
            className={classes.container}
            exclusive
            {...props}
            value={value}
            onChange={(e, v) => v && onChange(v)}
        >
            {children}
        </ToggleButtonGroup>
    )
}

export default StyledToggleButtons
