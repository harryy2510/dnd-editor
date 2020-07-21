import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({}: Theme) => ({}))

const ImageSettings: React.FC = () => {
    const classes = useStyles()
    return <div>BackgroundColor Created!</div>
}

export default ImageSettings
