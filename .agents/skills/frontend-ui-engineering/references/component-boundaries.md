# Component Boundaries

Create components around stable responsibilities, not arbitrary pieces of markup. Prefer meaningful children, slots, or primitives over a matrix of flags that describes unrelated layouts.

Keep state where the behavior is controlled. Lift it only when siblings genuinely coordinate, place shareable navigation state in the URL, and treat remote data as server state. Do not introduce global state merely to avoid passing a few props.

Separate data acquisition from presentational rendering when it clarifies loading, errors, or reuse. Do not force that split when it creates only a pass-through wrapper.
