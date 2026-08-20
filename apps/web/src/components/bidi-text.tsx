import type { ComponentPropsWithoutRef } from "react";

type Direction = "auto" | "ltr" | "rtl";

interface BidiTextProps extends Omit<ComponentPropsWithoutRef<"bdi">, "dir"> {
  dir?: Direction;
}

export function BidiText({
  dir = "auto",
  children,
  ...rest
}: BidiTextProps) {
  return (
    <bdi {...rest} dir={dir} data-bidi-isolate="">
      {children}
    </bdi>
  );
}
