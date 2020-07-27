import { Button, Card, ClickAwayListener, List, ListItem, Popper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { map } from 'lodash-es'
import { bindHover, bindPopper, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { nanoid } from 'nanoid'
import React from 'react'
import { useDndEditorContext } from '../../DndEditorProvider'

import './Editor.scss'
// @ts-ignore
import CKEditor from '@ckeditor/ckeditor5-react'
// @ts-ignore
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor'
// @ts-ignore
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
// @ts-ignore
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
// @ts-ignore
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
// @ts-ignore
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
// @ts-ignore
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
// @ts-ignore
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
// @ts-ignore
import Link from '@ckeditor/ckeditor5-link/src/link'
// @ts-ignore
import CkList from '@ckeditor/ckeditor5-list/src/list'
// @ts-ignore
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// @ts-ignore
import Table from '@ckeditor/ckeditor5-table/src/table'
// @ts-ignore
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
// @ts-ignore
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
// @ts-ignore
import Mention from '@ckeditor/ckeditor5-mention/src/mention'

interface Props {
    value?: string
    onChange?: (text: string) => void
}

const useStyles = makeStyles(({ zIndex }: Theme) => ({
    button: {
        minWidth: 0
    },
    popper: {
        zIndex: zIndex.tooltip,
        maxHeight: 320,
        overflow: 'auto'
    }
}))

const Editor: React.FC<Props> = ({ value, onChange }) => {
    const classes = useStyles()
    const popupId = React.useRef(`popup-${nanoid()}`).current
    const menuId = React.useRef(`menu-${nanoid()}`).current

    const { smartyTags } = useDndEditorContext()
    const allTags = map(smartyTags, (value, key) => `{{${key}}}`)

    const editorConfiguration = React.useMemo(
        () => ({
            toolbar: {
                shouldNotGroupWhenFull: true,
                items: [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'link',
                    'bulletedList',
                    'numberedList',
                    'insertTable'
                ]
            },
            plugins: [
                Mention,
                Essentials,
                Autoformat,
                Underline,
                Strikethrough,
                Bold,
                Italic,
                Link,
                CkList,
                Paragraph,
                Table,
                TableToolbar,
                TextTransformation
            ],
            ...(allTags.length
                ? {
                      mention: {
                          feeds: [
                              {
                                  marker: '{',
                                  feed: allTags,
                                  minimumCharacters: 0
                              }
                          ]
                      }
                  }
                : {})
        }),
        [smartyTags]
    )

    const containerRef = React.useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
    const editorRef = React.useRef<any>()
    const textRef = React.useRef(value ?? '')

    const popupState = usePopupState({
        popupId,
        variant: 'popper'
    })
    const menuState = usePopupState({
        popupId: menuId,
        variant: 'popper'
    })

    React.useEffect(() => {
        if (value !== textRef.current) {
            onChange?.(textRef.current)
        }
    }, [textRef.current])
    const handleTagInsert = (tag: string) => {
        menuState.close()
        const model = editorRef.current?.editor.model
        const range = model.document.selection.getLastRange()
        model.change((writer: any) => {
            const attributesMap = new Map()
            attributesMap.set('mention', {
                id: tag,
                text: tag,
                uid: nanoid(5),
                _text: tag
            })
            model.insertContent(writer.createText(tag, attributesMap), range)
            model.insertContent(writer.createText(' '), range.start.getShiftedBy(tag.length))
        })
    }
    return (
        <ClickAwayListener
            onClickAway={() => {
                popupState.close()
                menuState.close()
            }}
        >
            <div {...bindHover(popupState)} ref={containerRef}>
                {smartyTags && (
                    <>
                        <Popper
                            {...bindPopper(menuState)}
                            className={classes.popper}
                            placement="right-start"
                        >
                            <Card variant="outlined">
                                <List dense>
                                    {allTags.map((tag, i) => (
                                        <ListItem
                                            button
                                            key={i}
                                            onClick={() => handleTagInsert(tag)}
                                        >
                                            {tag}
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Popper>
                        <Popper
                            {...bindPopper(popupState)}
                            placement="right-start"
                            open={!menuState.isOpen && popupState.isOpen}
                            className={classes.popper}
                        >
                            <Card variant="outlined">
                                <Button
                                    className={classes.button}
                                    {...bindTrigger(menuState)}
                                    onClick={() => menuState.open(containerRef.current)}
                                >
                                    {'{{'}&middot;&middot;{'}}'}
                                </Button>
                            </Card>
                        </Popper>
                    </>
                )}

                <CKEditor
                    ref={editorRef}
                    editor={BalloonEditor}
                    config={editorConfiguration}
                    data={textRef.current}
                    onChange={(event: any, editor: any) => {
                        textRef.current = editor.getData()
                    }}
                />
            </div>
        </ClickAwayListener>
    )
}

export default Editor
