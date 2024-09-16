import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
    return (
        <Toaster
            toastOptions={{
                error: {
                    icon: null,
                    style: {
                        backgroundColor: "blue",
                        color: "#f8fafc",
                    },
                },
            }}
        />
    );
};
