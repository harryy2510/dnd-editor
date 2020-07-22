import { Trans } from '@lingui/macro'
import { ButtonBase, Card, ClickAwayListener, Popper, Theme, Tooltip } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { DeleteOutlined, SettingsOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks'
import React from 'react'
import PubSub from '../PubSub'
import { RenderProps } from '../types'
import { removeItem } from '../utils'

interface Props extends RenderProps, React.HTMLAttributes<HTMLDivElement> {}

const useStyles = makeStyles(
    ({ palette: { primary, text }, spacing, shape: { borderRadius } }: Theme) => ({
        root: {
            position: 'relative'
        },
        active: {
            outline: `1px solid ${primary.main}`
        },
        actions: {
            display: 'flex',
            flexDirection: 'column',
            '&$row': {
                flexDirection: 'row'
            }
        },
        button: {
            margin: spacing(0.5),
            padding: spacing(0.5),
            borderRadius,
            color: text.secondary,
            fontSize: '1.5rem',
            '&:hover': {
                backgroundColor: fade(primary.main, 0.1),
                color: primary.main
            }
        },
        row: {}
    })
)

const DndItemPreview: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
    (
        {
            children,
            setState,
            state,
            template,
            itemsMap,
            items,
            item,
            active,
            onActiveChange,
            ...props
        },
        ref
    ) => {
        const popupState = usePopupState({
            variant: 'popper',
            popupId: `${item?.id}-actions`
        })
        const renderProps = {
            setState,
            state,
            template,
            itemsMap,
            items,
            item,
            active,
            onActiveChange
        }
        const classes = useStyles()
        const handleClick = (ev: React.MouseEvent<any>) => {
            ev.stopPropagation()
            onActiveChange(item ? item.id : null)
        }
        const handleSettingsClick = (ev: React.MouseEvent<any>) => {
            handleClick(ev)
            PubSub.publish('component/click', { type: 'container', data: '__container' })
        }
        const handleDelete = (ev: React.MouseEvent<HTMLButtonElement>) => {
            ev.stopPropagation()
            removeItem(renderProps, item?.id)
        }
        return (
            <>
                <ClickAwayListener onClickAway={() => popupState.close()}>
                    <Popper
                        {...bindPopper(popupState)}
                        placement={item?.layoutId ? 'bottom-start' : 'left-start'}
                    >
                        <Card
                            variant="outlined"
                            className={clsx(classes.actions, item?.layoutId && classes.row)}
                        >
                            <Tooltip title={<Trans>Settings</Trans>}>
                                <ButtonBase
                                    onClick={handleSettingsClick}
                                    className={classes.button}
                                >
                                    <SettingsOutlined fontSize="inherit" />
                                </ButtonBase>
                            </Tooltip>
                            <Tooltip title={<Trans>Delete</Trans>}>
                                <ButtonBase onClick={handleDelete} className={classes.button}>
                                    <DeleteOutlined fontSize="inherit" />
                                </ButtonBase>
                            </Tooltip>
                        </Card>
                    </Popper>
                </ClickAwayListener>
                <div
                    {...bindHover(popupState)}
                    ref={ref}
                    {...props}
                    onClick={handleClick}
                    className={clsx(
                        classes.root,
                        props.className,
                        active === item?.id && classes.active
                    )}
                >
                    {children}
                </div>
            </>
        )
    }
)

export default DndItemPreview
