import { width } from "@mui/system";
import { Slide, toast } from "react-toastify";

export function toastSuccessMini(content: string) {
  toast.success(content, {
    autoClose: 2000,
    theme: "colored",
    style: { width: content == "" ? "50px" : "" },
    transition: Slide,
  });
}
export function toastErrMini(content: string) {
  toast.error(content, {
    autoClose: 2000,
    theme: "colored",
    transition: Slide,
    style: { width: content == "" ? "50px" : "" },
  });
}
