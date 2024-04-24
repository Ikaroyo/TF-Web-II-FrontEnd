// toast message

const toast = document.querySelector(".toast");

let toastTimeout;

function showToast(message, type) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toast.classList.remove("show");
  toast.classList.remove("success");
  toast.classList.remove("error");
  toast.classList.remove("info");

  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.add(type);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.remove(type);
  }, 3000);
}
