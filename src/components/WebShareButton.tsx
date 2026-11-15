"use client";

import { useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/Button";

type WebShareButtonProps = {
  title: string;
  /** The address to share. Without it, the address of the open page is shared. */
  url?: string;
};

function subscribe() {
  return () => {};
}

/** The device's own share sheet. The button only exists in browsers that support it. */
export function WebShareButton({ title, url }: WebShareButtonProps) {
  const supported = useSyncExternalStore(
    subscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  if (!supported) return null;

  async function share() {
    try {
      await navigator.share({ title, url: url ?? window.location.href });
    } catch {
      // The reader closed the share sheet. Nothing to do.
    }
  }

  return (
    <button type="button" onClick={share} className={buttonClasses("secondary")}>
      Share
    </button>
  );
}
