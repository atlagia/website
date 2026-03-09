/** DesignerShoes dark theme: all text uses --ds-text (light) / --ds-muted (light muted) for contrast on dark bg */
export const luxuryProductStyle = {
  title: "font-display text-3xl font-semibold tracking-tight text-[var(--ds-text)] mb-2 uppercase",
  price: "font-body text-2xl font-medium tracking-wide text-[var(--ds-text)]",
  breadcrumb: {
    link: "font-body text-[11px] tracking-[0.2em] text-[var(--ds-text)]/80 hover:text-[var(--ds-text)]",
    current: "font-body text-[11px] font-medium tracking-[0.2em] text-[var(--ds-text)]"
  },
  description: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ds-text)] mb-4 uppercase",
    content: "font-body text-[var(--ds-text)] [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-[var(--ds-text)] [&>li]:text-[var(--ds-text)] [&>strong]:text-[var(--ds-text)] [&>a]:text-[var(--ds-accent)]"
  },
  specs: {
    title: "font-display text-xl font-semibold text-[var(--ds-text)] mb-4 uppercase",
    label: "font-body text-sm text-[var(--ds-muted)]",
    value: "font-body text-sm text-[var(--ds-text)]"
  },
  reviews: {
    title: "font-display text-xl font-semibold text-[var(--ds-text)] mb-4 uppercase",
    author: "font-display text-sm font-semibold text-[var(--ds-text)]",
    date: "font-body text-sm text-[var(--ds-muted)]",
    content: "font-body text-base text-[var(--ds-text)]"
  },
  button: {
    primary: "font-display text-sm font-semibold tracking-[0.2em] uppercase text-[var(--ds-text)]",
    secondary: "font-display text-sm font-semibold tracking-[0.2em] uppercase text-[var(--ds-text)]"
  }
};
