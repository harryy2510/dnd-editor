import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { isEqual, keyBy } from 'lodash-es'
import React from 'react'
import { One, OneByFour, OneByThree, OneByTwo } from './assets/grids'
import DndEditorPreference from './components/DndEditorPreference'
import DndEditorPreview from './components/DndEditorPreview'
import DndEditorProvider from './DndEditorProvider'
import { Button, Divider, Image, Spacer, Text, Html } from './assets/components'
import { Mail } from './assets/layouts'
import { Content, Blocks, Settings } from './assets/tabs'
import { DndEditorProps, DndState } from './types'
import { createDndState, useDidMountEffect } from './utils'

const useStyles = makeStyles(({ direction, palette: { background }, spacing }: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
    },
    preview: {
        backgroundColor: background.paper,
        flex: 1
    },
    preferences: {
        backgroundColor: background.default,
        flex: `0 0 ${spacing(40)}px`,
        width: spacing(40),
        maxWidth: spacing(40),
        minWidth: spacing(40)
    }
}))

const DndEditor: React.FC<DndEditorProps> = ({
    value,
    onChange,
    items = [],
    layout = Mail,
    tabs = []
}) => {
    const [tab, setTab] = React.useState<number>(0)
    const [active, setActive] = React.useState<string | null>(null)
    const classes = useStyles()
    const [state, setState] = React.useState<DndState>(createDndState(value))
    const itemsMap = React.useMemo(() => keyBy(items, 'id'), [items])
    React.useEffect(() => {
        if (onChange && !isEqual(value, state)) {
            onChange(state)
        }
    }, [state])
    useDidMountEffect(() => {
        if (value && !isEqual(value, state)) {
            setState(createDndState(value))
        }
    }, [value])
    return (
        <DndEditorProvider
            active={active}
            onActiveChange={setActive}
            layout={layout}
            itemsMap={itemsMap}
            setState={setState}
            state={state}
            items={items}
            tab={tab}
            onTabChange={setTab}
            tabs={tabs}
        >
            <div className={classes.root}>
                <div className={classes.preview}>
                    <DndEditorPreview />
                </div>
                <div className={classes.preferences}>
                    <DndEditorPreference />
                </div>
            </div>
        </DndEditorProvider>
    )
}

DndEditor.defaultProps = {
    items: [Text, Html, Image, Button, Divider, Spacer, One, OneByTwo, OneByThree, OneByFour],
    tabs: [Content, Blocks, Settings]
}

export default DndEditor
