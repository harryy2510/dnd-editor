import { FormLabel, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles(({ palette: { text }, spacing }: Theme) => ({
    root: {
        fontSize: 11,
        textTransform: 'uppercase',
        marginBottom: spacing(0.75),
        display: 'block',
        color: text.hint,
        fontWeight: 600
    }
}))

const Label: React.FC = ({ children }) => {
    const classes = useStyles()
    return <FormLabel className={classes.root}>{children}</FormLabel>
}

export default Label
