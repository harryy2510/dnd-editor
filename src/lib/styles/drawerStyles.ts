import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useDrawerStyles = makeStyles(({ spacing, palette: { background } }: Theme) => ({
    root: {
        height: '100%',
        width: '100%'
    },
    paper: {
        backgroundColor: background.default,
        padding: spacing(2),
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'auto'
    }
}))
