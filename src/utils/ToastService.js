import { toast } from "react-toastify";
  
export function toastInfo (message) {
    return toast.info(message);
}

export function toastSuccess (message) {
    return toast.success(message);
}

export function toastError (message) {
    return toast.error(message);
}

export function toastWarn (message) {
    return toast.warn(message);
}

export function toastLoading(message) {
    return toast.loading(message);
}

export function toastUpdateSuccess(id, message) {
    setTimeout(() => {
        toast.update(id, { render: message, type: "success", isLoading: false, autoClose: 2000, closeOnClick: true, pauseOnHover: true });
    }, 100);
}

export function toastUpdateError(id, message) {
    setTimeout(() => {
        toast.update(id, { render: message, type: "error", isLoading: false, autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    }, 100);
}
