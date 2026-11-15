"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/Button";

type NativeShareButtonProps = {
  title: string;
  /** The page path, used when the site address is not known. */
  path: string;
  /** The full public address of the page, when the site address is known. */
  url?: string;
};

const subscribe = () => () => {};
const supportsShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";
const serverSupportsShare = () => false;

/** Opens the device share sheet. Renders nothing where the Web Share API is missing. */
export function NativeShareButton({ title, path, url }: NativeShareButtonProps) {
  const supported = useSyncExternalStore(subscribe, supportsShare, serverSupportsShare);
  if (!supported) return null;

  async function share() {
    const target = url ?? new URL(path, window.location.origin).href;
    try {
      await navigator.share({ title, url: target });
    } catch {
      // The reader closed the share sheet. Nothing to do.
    }
  }

  return (
    <Button variant="secondary" onClick={share}>
      Share
    </Button>
  );
}
