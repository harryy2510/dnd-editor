import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useTabsStyles = makeStyles(({ palette: { background, action } }: Theme) => ({
    root: {
        borderRadius: 10,
        minHeight: 44
    },
    flexContainer: {
        position: 'relative',
        padding: '0 3px',
        zIndex: 1
    },
    indicator: {
        top: 3,
        bottom: 3,
        right: 3,
        height: 'auto',
        borderRadius: 8,
        backgroundColor: background.paper,
        boxShadow: `0 4px 12px 0 ${action.disabledBackground}`
    }
}))
export const useTabItemStyles = makeStyles(({ palette }: Theme) => ({
    root: {
        '&:hover': {
            opacity: 1
        },
        minHeight: 44,
        minWidth: 80
    },
    wrapper: {
        color: palette.text.primary,
        textTransform: 'initial'
    }
}))
