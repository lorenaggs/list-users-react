interface HeaderProps {
    logout: () => void;
}


export const Header = ( {logout}: HeaderProps) => {
    /*const logout = () => {
        localStorage.clear();
        window.location.reload();
    }*/

    return (
        <header className="w-full h-24 bg-gradient-to-r from-green-600 to-green-500 shadow-xl p-6 lg:p-12">
            <div className="w-full h-full flex gap-6 items-center justify-between px-10 lg:px-16">
                <div className="flex gap-5 items-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-green-600 font-bold text-2xl">U</span>
                    </div>
                    <h2 className="text-white font-semibold text-2xl lg:text-3xl">Gestión de Usuarios</h2>
                </div>
                <button 
                    className="bg-white text-green-600 rounded-xl px-6 py-3 text-base font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl p-6"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    )
}