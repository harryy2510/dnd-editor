import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({}: Theme) => ({}))

const BackgroundColorSettings: React.FC = () => {
    const classes = useStyles()
    return <div>ColorSettings Created!</div>
}

export default BackgroundColorSettings
