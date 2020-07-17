import { Trans } from '@lingui/macro'
import { ButtonBase, Theme, Tooltip } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { DeleteOutlined, SettingsOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import React from 'react'
import { RenderProps } from '../types'
import { removeItem } from '../utils'

interface Props extends RenderProps, React.HTMLAttributes<HTMLDivElement> {}

const useStyles = makeStyles(
    ({ palette: { primary, error }, spacing, shape: { borderRadius } }: Theme) => ({
        root: {
            position: 'relative',
            '&:hover, &$active': {
                '& > $overlay': {
                    opacity: 1
                }
            }
        },
        overlay: {
            opacity: 0,
            position: 'absolute',
            display: 'flex',
            zIndex: 1,
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            pointerEvents: 'none',
            border: `2px solid ${primary.main}`
        },
        active: {},
        actions: {
            position: 'absolute',
            display: 'flex',
            left: 0,
            bottom: spacing(-3.25),
            backgroundColor: fade(primary.main, 0.9),
            color: primary.contrastText,
            borderBottomRightRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            pointerEvents: 'auto'
        },
        grid: {
            '& > $overlay': {
                borderColor: 'transparent',
                '& > $actions': {
                    top: 0,
                    bottom: 'auto',
                    flexDirection: 'column',
                    left: spacing(-3.25),
                    backgroundColor: fade(error.main, 0.9),
                    color: error.contrastText,
                    borderTopLeftRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: 0
                }
            }
        },
        button: {
            fontSize: '1rem',
            margin: spacing(0.5)
        }
    })
)

const DndItemPreview: React.FC<Props> = ({
    children,
    setState,
    state,
    layout,
    itemsMap,
    items,
    tabs,
    tab,
    onTabChange,
    item,
    theme,
    active,
    onActiveChange,
    ...props
}) => {
    const renderProps = {
        setState,
        state,
        layout,
        itemsMap,
        items,
        tabs,
        tab,
        onTabChange,
        item,
        theme,
        active,
        onActiveChange
    }
    const classes = useStyles()
    const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation()
        onActiveChange(item ? item.id : null)
    }
    const handleDelete = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation()
        removeItem(renderProps, item.id)
    }
    const stateItem = item && state.entities[item.id]
    return (
        <div
            {...props}
            onClick={handleClick}
            className={clsx(
                classes.root,
                props.className,
                active === item?.id && classes.active,
                stateItem && (classes as any)[stateItem.type]
            )}
        >
            <div className={classes.overlay}>
                <div className={classes.actions}>
                    <Tooltip title={<Trans>Settings</Trans>}>
                        <ButtonBase className={classes.button}>
                            <SettingsOutlined fontSize="inherit" />
                        </ButtonBase>
                    </Tooltip>
                    <Tooltip onClick={handleDelete} title={<Trans>Delete</Trans>}>
                        <ButtonBase className={classes.button}>
                            <DeleteOutlined fontSize="inherit" />
                        </ButtonBase>
                    </Tooltip>
                </div>
            </div>
            {children}
        </div>
    )
}

export default DndItemPreview
