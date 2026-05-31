import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type ThemeToggleProps = {
  variant?: 'light' | 'dark'
}

export function ThemeToggle({ variant = 'dark' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme state on mount
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 shadow-none hover:shadow-sm ${
        variant === 'light'
          ? 'text-white/90 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/25'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80'
      }`}
      aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
    >
      <div className="relative h-5 w-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <span
          className={`absolute transform transition-all duration-500 ease-out ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100 text-amber-400' 
              : 'rotate-90 scale-0 opacity-0 text-slate-400'
          }`}
        >
          <Sun className="h-5 w-5" />
        </span>

        {/* Moon Icon */}
        <span
          className={`absolute transform transition-all duration-500 ease-out ${
            isDark 
              ? '-rotate-90 scale-0 opacity-0 text-amber-400' 
              : 'rotate-0 scale-100 opacity-100 text-indigo-500 dark:text-indigo-300'
          }`}
        >
          <Moon className="h-5 w-5" />
        </span>
      </div>
    </button>
  )
}
