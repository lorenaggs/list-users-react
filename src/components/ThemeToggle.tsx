import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../hooks/useTheme";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="rounded-xl px-5 py-3 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 border-2 border-transparent"
            style={{ 
              backgroundColor: 'var(--bg-header-button)',
              color: 'var(--button-primary)',
              borderColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.borderColor = 'var(--button-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-header-button)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
            {theme === 'light' ? (
                <>
                    <FontAwesomeIcon icon={faMoon} />
                    <span className="hidden sm:inline"></span>
                </>
            ) : (
                <>
                    <FontAwesomeIcon icon={faSun} />
                    <span className="hidden sm:inline"></span>
                </>
            )}
        </button>
    );
};

