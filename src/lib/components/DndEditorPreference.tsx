import { Drawer, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import React from 'react'
import { useDndEditorContext } from '../DndEditorProvider'
import { useDrawerStyles } from '../styles/drawerStyles'
import { useTabItemStyles, useTabsStyles } from '../styles/tabStyles'
import { DndEditorPreferenceProps } from '../types'
import SwipeableViews from 'react-swipeable-views'

const useStyles = makeStyles(({ spacing }: Theme) => ({
    content: {
        padding: spacing(2, 1)
    }
}))

const DndEditorPreference: React.FC<DndEditorPreferenceProps> = ({}) => {
    const classes = useStyles()
    const { onTabChange, tab, tabs, active } = useDndEditorContext()
    const theme = useTheme<Theme>()
    const tabsStyles = useTabsStyles()
    const tabItemStyles = useTabItemStyles()
    const drawerStyles = useDrawerStyles()
    React.useEffect(() => {
        if (active) {
            const index = tabs.findIndex((t) => t.id === 'settings')
            if (index > -1 && index !== tab) {
                onTabChange(index)
            }
        }
    }, [active])
    return (
        <Drawer
            variant="permanent"
            classes={drawerStyles}
            anchor={theme.direction === 'rtl' ? 'left' : 'right'}
            ModalProps={{ keepMounted: true }}
        >
            <Tabs
                variant="fullWidth"
                value={tab}
                onChange={(event, newValue) => onTabChange(newValue)}
                classes={tabsStyles}
            >
                {tabs.map((item, i) => (
                    <Tab key={i} classes={tabItemStyles} disableRipple label={item.label} />
                ))}
            </Tabs>
            <SwipeableViews index={tab}>
                {tabs.map((item, i) => (
                    <div key={i} className={classes.content}>
                        {item.component}
                    </div>
                ))}
            </SwipeableViews>
        </Drawer>
    )
}

export default DndEditorPreference
