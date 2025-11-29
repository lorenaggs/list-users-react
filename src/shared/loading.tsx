import {TailSpin} from "react-loader-spinner";

interface LoadingProps {
    loading: boolean | undefined;
}

export const Loading = (loading: LoadingProps) => {
    return (
        <>
            <div className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex items-center justify-center z-50 ${loading.loading ? '' : 'hidden'}`}>
                <TailSpin
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading spinner example"
                    visible={loading.loading}
                />
            </div>
        </>
    )
}