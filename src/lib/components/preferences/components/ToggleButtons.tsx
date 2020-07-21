import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import Label from './Label'
import StyledToggleButtons, { StyledToggleButtonsProps } from './StyledToggleButtons'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    container: {
        width: '100%',
        marginBottom: spacing(1)
    }
}))

export interface ToggleButtonsProps extends StyledToggleButtonsProps {
    label: React.ReactNode
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ label, ...props }) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <Label>{label}</Label>
            <StyledToggleButtons {...props} />
        </div>
    )
}

export default ToggleButtons
