import toast, { Toaster } from "react-hot-toast";

export const toastMessage = (type, message) => {
    if (type === "error") {
        toast.error(message);
    } else if (type === "success") {
        toast.success(message);
    }
}