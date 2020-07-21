import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({}: Theme) => ({}))

const BackgroundImageSettings: React.FC = () => {
    const classes = useStyles()
    return <div>BackgroundImage Created!</div>
}

export default BackgroundImageSettings
