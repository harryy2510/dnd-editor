import { Box, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { DndEditor } from './lib'
import { DndState } from './lib/types'
import { createDndState } from './lib/utils'

export const useLocalStorage = <T extends any = any>(
    key: string,
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = React.useState<T>(() => {
        const storedValue = window.localStorage.getItem(key)
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue
    })
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
    return [value, setValue]
}

function App() {
    const [value, onChange] = useLocalStorage<DndState>('dnd-test-2', createDndState())
    return (
        <ThemeProvider
            theme={createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } })}
        >
            <CssBaseline />
            <Box position="absolute" top={0} right={0} bottom={0} left={0}>
                <DndEditor value={value} onChange={onChange} />
            </Box>
        </ThemeProvider>
    )
}

export default App
