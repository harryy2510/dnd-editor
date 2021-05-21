import PubSub from '@harryy/pubsub'
import { Trans } from '@lingui/macro'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { DndContainerItem, RenderProps } from '../types'
import { styleToCss } from '../utils'

const Form: Partial<DndContainerItem> = {
    initialValues: {
        style: {
            padding: '12px 16px 12px 16px',
            backgroundColor: '',
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'left'
        }
    }
}
const Mail: Partial<DndContainerItem> = {
    initialValues: {
        style: {
            padding: '24px 48px 24px 48px',
            backgroundColor: '',
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'left'
        }
    }
}

const useStyles = makeStyles(({ typography: { caption } }: Theme) => ({
    label: {
        '& .subtitle': {
            display: 'none',
            fontSize: caption.fontSize
        },
        '&:hover': {
            '& .subtitle': {
                display: 'block'
            }
        }
    }
}))

const Label: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.label}>
            <div>
                <Trans>Container</Trans>
            </div>
            <div className="subtitle">
                <Trans> Control the background, alignment and padding of the selected block </Trans>
            </div>
        </div>
    )
}

const defaultContainer: DndContainerItem = {
    render: (renderProps: RenderProps, children?: React.ReactNode) => {
        if (!renderProps.item) {
            return null
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.__container

        const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
            if (ev.currentTarget === ev.target) {
                PubSub.publish('component/click', { type: 'container', data: '__container' })
            }
        }
        const modifiedStyle = {
            ...state?.style,
            ...(state?.style?.backgroundImage
                ? { backgroundImage: `url(${state.style.backgroundImage})` }
                : {})
        }
        return (
            <div onClick={handleClick} style={modifiedStyle}>
                {children}
            </div>
        )
    },
    export: (renderProps: RenderProps, children?: string | undefined) => {
        if (!renderProps.item) {
            return ''
        }
        const state = renderProps.state.entities[renderProps.item.id]?.values?.__container
        const modifiedStyle = {
            ...state?.style,
            ...(state?.style?.backgroundImage
                ? { backgroundImage: `url(${state.style.backgroundImage})` }
                : {})
        }

        if (state?.outlook) {
            return ` 
                <table style="width: 100%">
                    <tbody>
                        <tr>
                            <td style="${styleToCss(modifiedStyle)}">
                                ${children}
                            </td>
                        </tr>
                    </tbody>
                </table>
            `
        }

        return `
            <div style="${styleToCss(modifiedStyle)}">
                ${children}
            </div>
        `
    },
    initialValues: {
        style: {
            padding: '24px 48px 24px 48px',
            backgroundColor: '',
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center'
        },
        outlook: false
    },
    settings: [
        {
            id: '__container',
            settings: [
                { id: 'style.backgroundImage', type: 'image', grid: 12 },
                { id: 'style.padding', type: 'imagePadding', grid: 12 },
                { id: 'style.textAlign', type: 'align', grid: 12 },
                {
                    id: 'style.backgroundColor',
                    type: 'backgroundColor',
                    grid: 12,
                    hideIfSet: 'style.backgroundImage'
                },
                { id: 'outlook', type: 'labeledSwitch', grid: 12, label: <Trans>Outlook</Trans> }
            ],
            label: <Label />,
            type: 'container'
        }
    ]
}

const containers: Record<string, DndContainerItem> = {
    form: {
        ...defaultContainer,
        ...Form
    },
    mail: {
        ...defaultContainer,
        ...Mail
    }
}

export default containers
