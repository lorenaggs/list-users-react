import { TailSpin } from "react-loader-spinner";

interface LoadingProps {
    loading: boolean | undefined;
}

const LOADER_CONFIG = {
    height: 80,
    width: 80,
    color: '#22c55e'
} as const;

export const Loading = ({ loading }: LoadingProps) => {
    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'var(--bg-card)', opacity: 0.8 }}>
            <div className="flex flex-col items-center gap-4">
                <TailSpin
                    height={LOADER_CONFIG.height}
                    width={LOADER_CONFIG.width}
                    color={LOADER_CONFIG.color}
                    ariaLabel="Cargando usuarios"
                    visible={true}
                />
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Cargando usuarios...</p>
            </div>
        </div>
    )
}