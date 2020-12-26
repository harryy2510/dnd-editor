import React from 'react'
import { DndState, DndEditorContextProps } from './types'
import { Grid } from '@material-ui/core'
import { useFonts } from './utils'
import { useDeepCompare } from '@harryy/rehooks'
import { Mail } from './assets/templates'
import { keyBy } from 'lodash-es'
import DndEditorProvider from './DndEditorProvider'
import FormRenderer from './components/FormRenderer'
import * as Groups from './assets/groups'
import * as Blocks from './assets/blocks'
import * as Templates from './assets/templates'
import FormElement from './assets/blocks/FormElement'

export interface RendererProps {
    value: DndState
    formId: string
    onChange?: (newValue: any) => void
    onSubmit?: (newValue: any) => void
    onBlur?: (newValue: any) => void
    smartyTags?: Record<string, string>
    sampleData?: any
    template?: any
    items?: any[]
    initialValues: any
}
const Renderer: React.FC<RendererProps> = ({
    value,
    items = [],
    smartyTags,
    sampleData,
    onChange,
    onSubmit,
    formId,
    ...props
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
    const template = Mail
    const itemsMap = { ...React.useMemo(() => keyBy(items, 'id'), [items]), element: FormElement }
    const editorContextProps: DndEditorContextProps = {
        active: null,
        onActiveChange: () => {},
        template,
        itemsMap,
        setState: () => {},
        state: value,
        items,
        smartyTags,
        sampleData,
        buildermode: false
    }

    const children = (
        <Grid container>
            <Grid>
                <FormRenderer formId={formId} onSubmit={onSubmit} onChange={onChange}>
                    {props.children}
                </FormRenderer>
            </Grid>
        </Grid>
    )

    return <DndEditorProvider {...editorContextProps}>{children}</DndEditorProvider>
}
Renderer.defaultProps = {
    items: [...Object.values(Groups), ...Object.values(Blocks)],
    template: Templates.Mail
}
export default Renderer
