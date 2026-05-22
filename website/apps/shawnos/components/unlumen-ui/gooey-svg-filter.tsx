"use client";

export interface GooeySvgFilterProps {
  /** The filter identifier used in CSS `filter: url(#id)` references. */
  id?: string;
  /** Controls the intensity of the gooey effect. Higher values = more blur = stronger merge. */
  strength?: number;
}

export default function GooeySvgFilter({
  id = "gooey-filter",
  strength = 15,
}: GooeySvgFilterProps) {
  return (
    <svg className="absolute hidden">
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur-sm"
          />
          <feColorMatrix
            in="blur-sm"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}