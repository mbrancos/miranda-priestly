import { useState, useCallback } from 'react'

export function useTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    return { theme, toggleTheme }
}
