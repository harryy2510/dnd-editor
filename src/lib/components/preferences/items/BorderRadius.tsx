import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import {
    CheckBoxOutlineBlankOutlined,
    RadioButtonUncheckedOutlined,
    StopOutlined
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { InputProps } from '../components/Input'
import Label from '../components/Label'
import StyledTextField from '../components/StyledTextField'
import StyledToggleButtons, { ToggleButtonOption } from '../components/StyledToggleButtons'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    container: {
        width: '100%',
        marginBottom: spacing(1)
    },
    flex: {
        display: 'flex',
        '& > div': {
            '&:first-child': {
                marginRight: spacing(1),
                flex: 3
            },
            '&:last-child': {
                flex: 5
            }
        }
    }
}))

const BorderRadius: React.FC<InputProps> = (props) => {
    const classes = useStyles()
    const options: ToggleButtonOption[] = [
        {
            id: '50px',
            icon: RadioButtonUncheckedOutlined
        },
        {
            id: '4px',
            icon: CheckBoxOutlineBlankOutlined
        },
        {
            id: '0px',
            icon: StopOutlined
        }
    ]
    return (
        <div className={classes.container}>
            <Label>
                <Trans>Border Radius</Trans>
            </Label>
            <div className={classes.flex}>
                <StyledTextField {...props} />
                <StyledToggleButtons
                    options={options}
                    value={props.value}
                    onChange={props.onChange}
                />
            </div>
        </div>
    )
}

export default BorderRadius
