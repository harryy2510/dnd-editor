import { Grid, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { keyBy } from 'lodash-es'
import React from 'react'

import * as Groups from './assets/groups'
import * as Blocks from './assets/blocks'
import * as Layouts from './assets/layouts'
import * as Templates from './assets/templates'
import DndEditorMenu from './components/DndEditorMenu'
import DndEditorPreferences from './components/DndEditorPreferences'
import DndEditorPreview from './components/DndEditorPreview'
import DndEditorProvider from './DndEditorProvider'
import { DndItem, DndState, DndTemplateItem } from './types'
import { createDndState } from './utils'

export interface DndEditorProps {
    value?: Partial<DndState>
    onChange?: (newValue: DndState) => void
    items?: DndItem[]
    template?: DndTemplateItem
}

const useStyles = makeStyles(({ palette: { background, divider, action }, spacing }: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: background.paper,
        '&  *::-webkit-scrollbar-thumb': {
            background: action.focus,
            borderRadius: 20
        },
        '&  *::-webkit-scrollbar': {
            width: 5,
            height: 8,
            borderRadius: 20,
            backgroundColor: 'transparent'
        }
    },
    item: {
        height: '100%',
        overflowX: 'visible',
        overflowY: 'auto'
    },
    menu: {
        flex: `0 0 ${spacing(15)}px`,
        width: spacing(15),
        borderRight: `1px solid ${fade(divider, 0.08)}`
    },
    preview: {
        backgroundColor: action.hover,
        flex: 1,
        width: `calc(100% - ${spacing(55)}px)`
    },
    preferences: {
        flex: `0 0 ${spacing(40)}px`,
        width: spacing(40),
        borderLeft: `1px solid ${fade(divider, 0.08)}`
    }
}))

const DndEditor: React.FC<DndEditorProps> = ({
    value,
    onChange,
    items = [],
    template = Templates.Mail
}) => {
    const [active, setActive] = React.useState<string | null>(null)
    const classes = useStyles()
    const [state, setState] = React.useState<DndState>(createDndState(value, template))
    const itemsMap = React.useMemo(() => keyBy(items, 'id'), [items])

    React.useEffect(() => {
        if (onChange) {
            onChange(state)
        }
    }, [state])

    const children = React.useMemo(
        () => (
            <Grid container className={classes.root}>
                <Grid item className={clsx(classes.item, classes.menu)}>
                    <DndEditorMenu />
                </Grid>
                <Grid item className={clsx(classes.item, classes.preview)}>
                    <DndEditorPreview />
                </Grid>
                <Grid item className={clsx(classes.item, classes.preferences)}>
                    <DndEditorPreferences />
                </Grid>
            </Grid>
        ),
        [classes]
    )
    return (
        <DndEditorProvider
            active={active}
            onActiveChange={setActive}
            template={template}
            itemsMap={itemsMap}
            setState={setState}
            state={state}
            items={items}
        >
            {children}
        </DndEditorProvider>
    )
}

DndEditor.defaultProps = {
    items: [...Object.values(Layouts), ...Object.values(Groups), ...Object.values(Blocks)],
    template: Templates.Mail
}

export default DndEditor
