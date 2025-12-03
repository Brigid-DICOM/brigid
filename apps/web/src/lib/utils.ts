import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / 1024 ** i * 100) / 100} ${sizes[i]}`;
};


export function closeContextMenu() {
  const openContextMenus = document.querySelectorAll("[data-radix-menu-content]");
  openContextMenus.forEach((menu) => {
    const escEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      bubbles: true,
      cancelable: true,
    });
    menu.dispatchEvent(escEvent);
  });
}

export function closeDropdownMenu() {
  const openDropdownMenus = document.querySelectorAll("[data-radix-menu-content]");
  openDropdownMenus.forEach((menu) => {
    const escEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      bubbles: true,
      cancelable: true,
    });
    menu.dispatchEvent(escEvent);
  });
}