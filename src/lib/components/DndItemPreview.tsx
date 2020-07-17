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
    ({ palette: { primary, error, background }, spacing, shape: { borderRadius } }: Theme) => ({
        root: {
            position: 'relative',
            padding: spacing(0.5),
            backgroundColor: background.paper,
            '&:hover, &$active': {
                '& > $component-actions, & > $grid-actions': {
                    opacity: 1
                }
            }
        },
        component: {
            '&:hover, &$active': {
                boxShadow: `2px 2px 0px ${primary.main} inset, -2px -2px 0px ${primary.main} inset, 2px -2px 0px ${primary.main} inset, -2px 2px 0px ${primary.main} inset`
            }
        },
        grid: {
            '&:hover, &$active': {
                boxShadow: `2px 2px 0px ${error.main} inset, -2px -2px 0px ${error.main} inset, 2px -2px 0px ${error.main} inset, -2px 2px 0px ${error.main} inset`
            }
        },
        'component-actions': {
            left: 0,
            bottom: spacing(-3),
            backgroundColor: fade(primary.main, 0.9),
            color: primary.contrastText,
            borderBottomRightRadius: borderRadius,
            borderBottomLeftRadius: borderRadius
        },
        'grid-actions': {
            top: 0,
            flexDirection: 'column',
            left: spacing(-3),
            backgroundColor: fade(error.main, 0.9),
            color: error.contrastText,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius
        },
        active: {},
        actions: {
            opacity: 0,
            position: 'absolute',
            display: 'flex',
            zIndex: 1
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
            <div
                className={clsx(
                    classes.actions,
                    stateItem && (classes as any)[`${stateItem.type}-actions`]
                )}
            >
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
            {children}
        </div>
    )
}

export default DndItemPreview
