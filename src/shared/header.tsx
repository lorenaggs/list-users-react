export const Header = () => {

    const logout = () => {
        localStorage.clear();
    }

    return (
        <>
            <div className="w-full h-16 bg-gray-200 flex gap-4 items-center justify-between p-4">
                <div className="flex gap-4 items-center">
                    <img src="../../public/vite.svg" alt="logo" className="logo"/>
                    Bienvenido
                </div>
                <button className="bg-red-500 text-white rounded-md px-4 py-2 h-10"
                onClick={logout}
                >Cerrar sesión
                </button>
            </div>

        </>
    )

}