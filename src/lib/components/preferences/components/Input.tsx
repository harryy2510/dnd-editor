import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import Label from './Label'
import StyledTextField, { StyledTextFieldProps } from './StyledTextField'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    container: {
        width: '100%',
        marginBottom: spacing(1)
    }
}))

export interface InputProps extends StyledTextFieldProps {}

const Input: React.FC<StyledTextFieldProps> = ({ label, ...props }) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <Label>{label}</Label>
            <StyledTextField {...props} />
        </div>
    )
}

export default Input
