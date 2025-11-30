import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "../components/ThemeToggle";

interface HeaderProps {
    logout: () => void;
    onRefresh?: () => void;
}

export const Header = ({ logout, onRefresh }: HeaderProps) => {
    return (
        <header className="w-full h-24 shadow-xl" style={{ background: 'var(--header-gradient)' }}>
            <div className="w-full h-full flex gap-6 items-center justify-between px-10 lg:px-16">
                <div className="flex gap-5 items-center">
                    <div className="rounded-full flex items-center justify-center shadow-lg" style={{ width: '56px', height: '56px', backgroundColor: 'var(--bg-header-button)' }}>
                        <span className="font-bold text-2xl" style={{ color: 'var(--button-primary)' }}>U</span>
                    </div>
                    <h2 className="text-white font-semibold text-2xl lg:text-3xl">Gestión de Usuarios</h2>
                </div>
                <div className="flex gap-3 items-center">
                    <ThemeToggle />
                    {onRefresh && (
                        <button
                            className="rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                            style={{ 
                                backgroundColor: 'var(--bg-header-button)',
                                color: 'var(--text-green-header)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-header-button)'}
                            onClick={onRefresh}
                            title="Eliminar todos y recargar del API"
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                    )}
                    <button 
                        className="rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                        style={{ 
                            backgroundColor: 'var(--bg-header-button)',
                            color: 'var(--text-green-header)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-header-button)'}
                        onClick={logout}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    )
}