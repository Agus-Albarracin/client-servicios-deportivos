# Interaction and Accessibility

Start with native controls: `button` for actions, `a` for navigation, `label` for form controls, and semantic headings and lists for document structure. Add ARIA only when native semantics cannot express the required relationship.

Every control needs visible focus and keyboard access. Opening a dialog moves focus into it; closing it returns focus to the invoking control when useful. Do not use clickable non-interactive elements when a native control works.

Give inputs a programmatic label. Associate errors, help text, and validation status with the affected field. Preserve entered values after recoverable errors and never convey state through color alone.

Consult [W3C WCAG guidance](https://www.w3.org/WAI/standards-guidelines/wcag/) and the [MDN ARIA reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) for a specific accessibility pattern.
