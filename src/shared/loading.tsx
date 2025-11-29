import { TailSpin } from "react-loader-spinner";

interface LoadingProps {
    loading: boolean | undefined;
}

export const Loading = ({ loading }: LoadingProps) => {
    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <TailSpin
                    height="80"
                    width="80"
                    color="#22c55e"
                    ariaLabel="Cargando usuarios"
                    visible={true}
                />
                <p className="text-gray-600 font-medium">Cargando usuarios...</p>
            </div>
        </div>
    )
}