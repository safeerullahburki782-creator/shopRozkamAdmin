import Swal from "sweetalert2";

export const SweetAlert = (
  title?: string,
  text?: string,
  icon?: "success" | "error" | "warning" | "info" | "question",
  confirmButtonText?: string,
  confirmButtonColor?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
      iconColor: "#d33",
      customClass: {
        popup: "alert-modal",
      },
    }).then((result) => {
      resolve(result.isConfirmed);
    });
  });
};
