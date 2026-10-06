import clsx from 'clsx';
import Swal, { SweetAlertCustomClass, SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

const toastDefaults: SweetAlertOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: "bg-(--core-grey-6)! text-(--core-white)! border-l-2! border-b-2! border-l-(--core-rich-black)! border-b-(--core-rich-black)! border-r-2! border-r-(--core-grey-5)! border-t-2! border-t-(--core-grey-5)! drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)]! rounded-none!",
        title: "text-(--core-white)!",
        timerProgressBar: "bg-(--core-green-4)!",
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
};

const modalDefaults: SweetAlertOptions = {
    toast: false,
    position: 'center',
    background: 'var(--core-grey-6, #1b1b1b)',
    color: 'var(--core-white, #ffffff)',
    confirmButtonColor: '#008542',
    cancelButtonColor: '#4e4e50',
    denyButtonColor: '#b42d10',
    customClass: {
        popup: "bg-(--core-grey-6)! text-(--core-white)! border-l-2! border-b-2! border-l-(--core-rich-black)! border-b-(--core-rich-black)! border-r-2! border-r-(--core-grey-5)! border-t-2! border-t-(--core-grey-5)! drop-shadow-[0_8px_0px_rgba(0,0,0,0.5)]! rounded-none!",
        title: "text-(--core-white)! font-bold!",
        htmlContainer: "text-(--core-grey-2)!",
        confirmButton: "px-5! py-2! rounded-none! font-bold! text-white! border-b-2! border-r-2! border-black! cursor-pointer! text-sm!",
        cancelButton: "px-5! py-2! rounded-none! font-bold! text-white! border-b-2! border-r-2! border-black! cursor-pointer! text-sm!",
        denyButton: "px-5! py-2! rounded-none! font-bold! text-white! border-b-2! border-r-2! border-black! cursor-pointer! text-sm!",
        actions: "gap-3!",
    }
};

function mergeCustomClass(base?: SweetAlertCustomClass, custom?: SweetAlertCustomClass): SweetAlertCustomClass {
    if (!base) return custom || {};
    if (!custom) return base;
    const result: Record<string, any> = { ...base };
    for (const [key, value] of Object.entries(custom)) {
        if (result[key] && value) {
            result[key] = clsx(result[key], value);
        } else if (value) {
            result[key] = value;
        }
    }
    return result as SweetAlertCustomClass;
}

function isModalOptions(options: SweetAlertOptions): boolean {
    if (options.toast === true) return false;
    if (options.toast === false) return true;

    if (
        options.showCancelButton ||
        options.showDenyButton ||
        options.showConfirmButton === true ||
        options.confirmButtonText !== undefined ||
        options.denyButtonText !== undefined ||
        options.cancelButtonText !== undefined ||
        options.input !== undefined ||
        options.allowOutsideClick !== undefined ||
        options.allowEscapeKey !== undefined ||
        options.showLoaderOnConfirm !== undefined ||
        (options.position && options.position !== 'top-end')
    ) {
        return true;
    }

    return false;
}

function customFire(...args: any[]): Promise<any> {
    if (args.length === 0) {
        return (Swal.fire as any)();
    }

    if (typeof args[0] === 'string') {
        const [title, html, icon] = args;
        return (Swal.fire as any)({
            ...modalDefaults,
            title,
            html,
            icon: icon as SweetAlertIcon,
        });
    }

    const options: SweetAlertOptions = args[0] || {};
    if (isModalOptions(options)) {
        return (Swal.fire as any)({
            ...modalDefaults,
            ...options,
            customClass: mergeCustomClass(modalDefaults.customClass, options.customClass),
        });
    }

    return (Swal.fire as any)({
        ...toastDefaults,
        ...options,
        customClass: mergeCustomClass(toastDefaults.customClass, options.customClass),
        didOpen: (el: HTMLElement) => {
            toastDefaults.didOpen?.(el);
            options.didOpen?.(el);
        }
    });
}

export const AppSwal: typeof Swal = new Proxy(Swal, {
    apply(_target, thisArg, argArray) {
        return customFire.apply(thisArg, argArray);
    },
    get(target, prop, receiver) {
        if (prop === 'fire') {
            return customFire;
        }
        return Reflect.get(target, prop, receiver);
    }
});

export default AppSwal;
