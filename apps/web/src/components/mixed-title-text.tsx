import { Fragment } from "react";

const latinPhrase = /([A-Za-z0-9][A-Za-z0-9\s&+.'’:/_-]*[A-Za-z0-9]|[A-Za-z0-9])/g;

export function MixedTitleText({ children }: { children: string }) {
  const parts = children.split(latinPhrase).filter(Boolean);
  return (
    <span className="mixed-title" dir="rtl">
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          <bdi dir={/[A-Za-z]/.test(part) ? "ltr" : "rtl"}>{part}</bdi>
        </Fragment>
      ))}
    </span>
  );
}
