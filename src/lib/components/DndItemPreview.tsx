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
    ({ palette: { primary, text }, spacing, shape: { borderRadius }, zIndex }: Theme) => ({
        root: {
            position: 'relative',
            zIndex: 0
        },
        active: {
            outline: `1px solid ${primary.main}`,
            zIndex: 1
        },
        actions: {
            marginRight: 4,
            display: 'flex',
            flexDirection: 'column'
        },
        button: {
            margin: spacing(0.25),
            padding: spacing(0.25),
            borderRadius,
            color: text.secondary,
            fontSize: '1.5rem',
            '&:hover': {
                backgroundColor: fade(primary.main, 0.1),
                color: primary.main
            }
        },
        popper: {
            zIndex: zIndex.tooltip
        }
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
            smartyTags,
            sampleData,
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
        const isActive = active === item?.id
        return (
            <ClickAwayListener onClickAway={() => popupState.close()}>
                <div
                    {...bindHover(popupState)}
                    ref={ref}
                    {...props}
                    onClick={handleClick}
                    className={clsx(classes.root, props.className, isActive && classes.active)}
                >
                    {children}
                    <Popper
                        {...bindPopper(popupState)}
                        open={popupState.isOpen || isActive}
                        placement="left-start"
                        className={classes.popper}
                    >
                        <Card variant="outlined" className={classes.actions}>
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
                </div>
            </ClickAwayListener>
        )
    }
)

export default DndItemPreview
