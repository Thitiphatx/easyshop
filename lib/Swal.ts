import Swal from 'sweetalert2';

export const AppSwal = Swal.mixin({
    toast: true,
    position: 'top-end',
    theme: 'dark',
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
});

export default AppSwal;
