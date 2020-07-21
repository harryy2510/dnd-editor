import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({}: Theme) => ({}))

const TextSettings: React.FC = () => {
    const classes = useStyles()
    return <div>Text Created!</div>
}

export default TextSettings
