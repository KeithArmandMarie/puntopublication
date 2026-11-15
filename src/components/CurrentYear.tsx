"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** The current year. Built pages show the build year until the device fills it in. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );
  return <>{year}</>;
}
