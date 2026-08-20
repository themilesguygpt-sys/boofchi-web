import type { ReactNode } from "react";

import { BidiText } from "@/components/bidi-text";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id: string;
  index?: string;
}

export function SectionHeading({ eyebrow, title, description, id, index }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          {index ? <BidiText dir="ltr">{index}</BidiText> : null}
          {eyebrow}
        </p>
        <h2 id={id}>{title}</h2>
      </div>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </div>
  );
}
