import { Box, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { DndEditor } from './lib'
import { DndState } from './lib/types'
import { createDndState } from './lib/utils'

function App() {
    const [value, onChange] = React.useState<DndState>(createDndState())
    return (
        <ThemeProvider theme={createMuiTheme()}>
            <CssBaseline />
            <Box position="absolute" top={0} right={0} bottom={0} left={0}>
                <DndEditor value={value} onChange={onChange} />
            </Box>
        </ThemeProvider>
    )
}

export default App
