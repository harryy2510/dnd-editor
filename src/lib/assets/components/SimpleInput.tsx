import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { InputBase } from '@material-ui/core'

const useStyles = makeStyles(({}: Theme) => ({
    root: {
        color: 'inherit',
        textAlign: 'inherit',
        fontWeight: 'inherit',
        '& input': {
            padding: 0,
            color: 'inherit',
            textAlign: 'inherit',
            fontWeight: 'inherit'
        }
    }
}))

interface Props {
    value?: string
    onChange?: (text: string) => void
    style?: React.CSSProperties
}

const SimpleInput: React.FC<Props> = ({ value, onChange, style }) => {
    const classes = useStyles()
    const textRef = React.useRef(value ?? '')
    React.useEffect(() => {
        if (value !== textRef.current) {
            onChange?.(textRef.current)
        }
    }, [textRef.current])
    return (
        <InputBase
            fullWidth
            className={classes.root}
            defaultValue={textRef.current}
            onChange={(ev) => (textRef.current = ev.target.value)}
            style={style}
        />
    )
}

export default SimpleInput
