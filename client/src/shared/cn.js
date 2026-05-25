// Class helper: merges Tailwind class names safely.
// It keeps conditional CSS class building simple.
// Use this file whenever class names depend on state.
export const cn = (...classes) => classes.filter(Boolean).join(' ');
