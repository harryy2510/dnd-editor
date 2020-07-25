import { Grid, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { keyBy } from 'lodash-es'
import React from 'react'

import * as Groups from './assets/groups'
import * as Blocks from './assets/blocks'
import * as Templates from './assets/templates'
import DndEditorMenu from './components/DndEditorMenu'
import DndEditorPreferences from './components/DndEditorPreferences'
import DndEditorPreview from './components/DndEditorPreview'
import DndPreview from './components/DndPreview'
import DndEditorProvider from './DndEditorProvider'
import { DndItem, DndState, DndTemplateItem } from './types'
import { createDndState, useDeepCompare, useFonts } from './utils'

export interface DndEditorProps {
    value?: Partial<DndState>
    onChange?: (newValue: DndState) => void
    items?: DndItem[]
    template?: DndTemplateItem
    smartyTags?: string[]
    sampleData?: any
}

const useStyles = makeStyles(({ palette: { background, divider, action }, spacing }: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: background.paper
    },
    item: {
        height: '100%',
        overflowX: 'visible',
        overflowY: 'auto',
        position: 'relative'
    },
    menu: {
        flex: `0 0 ${spacing(20)}px`,
        width: spacing(20),
        borderRight: `1px solid ${fade(divider, 0.08)}`
    },
    preview: {
        backgroundColor: action.hover,
        flex: 1,
        width: `calc(100% - ${spacing(60)}px)`
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
    template = Templates.Mail,
    smartyTags,
    sampleData
}) => {
    const { fontWeights, fontFamily } = useFonts()
    const fonts = useDeepCompare(
        fontFamily.map((family) => [family.id, ...fontWeights.map((i) => i.id.toString())])
    )
    React.useEffect(() => {
        const fontsWithSizes = fonts.map((fontArray) => {
            const font = fontArray[0].replace(new RegExp(' ', 'g'), '+')
            let sizes = ''
            if (fontArray.length === 2) {
                sizes = ':' + fontArray[1]
            }
            return font + sizes
        })
        const fontsUri = fontsWithSizes.join('|')
        const swap = `&display=swap`
        const href = `https://fonts.googleapis.com/css?family=${fontsUri + swap}`
        const link = document.getElementById('google-fonts')
        if (link) {
            link.setAttribute('href', href)
        } else {
            const el = document.createElement('link')
            el.href = href
            el.rel = 'stylesheet'
            el.id = 'google-fonts'
            document.head.appendChild(el)
        }
    }, [fonts])
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
            <>
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
                <DndPreview />
            </>
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
            smartyTags={smartyTags}
            sampleData={sampleData}
        >
            {children}
        </DndEditorProvider>
    )
}

DndEditor.defaultProps = {
    items: [...Object.values(Groups), ...Object.values(Blocks)],
    template: Templates.Mail
}

export default DndEditor
