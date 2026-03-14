/**
 * Product page luxury styles. GlobalGiftCards digital-marketplace — premium token-based.
 * Fluid typography (clamp), WCAG 2.2 contrast, microinteractions 120–200ms.
 */
export const luxuryProductStyle = {
  title: "font-display text-[clamp(1.5rem,4vw,1.875rem)] font-semibold tracking-tight text-[var(--ggc-text)] mb-2",

  price: "font-display text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-[var(--ggc-text)]",

  breadcrumb: {
    link: "font-body text-[clamp(0.8125rem,1.5vw,0.875rem)] text-[var(--ggc-muted)] hover:text-[var(--ggc-accent)] transition-colors duration-150",
    current: "font-body text-[clamp(0.8125rem,1.5vw,0.875rem)] font-medium text-[var(--ggc-text)]"
  },

  description: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4",
    content: "text-[var(--ggc-text)] [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>strong]:font-bold [&>a]:text-[var(--ggc-accent)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
  },

  specs: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4",
    label: "text-sm font-medium text-[var(--ggc-muted)]",
    value: "text-sm text-[var(--ggc-text)]"
  },

  reviews: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4",
    author: "text-sm font-medium text-[var(--ggc-text)]",
    date: "text-sm text-[var(--ggc-muted)]",
    content: "text-base text-[var(--ggc-muted)]"
  },

  related: {
    title: "font-display text-[clamp(1.25rem,3vw,1.5rem)] font-semibold tracking-tight text-[var(--ggc-text)] mb-6",
    productTitle: "text-base font-medium text-[var(--ggc-text)]",
    productPrice: "text-sm text-[var(--ggc-muted)]"
  },

  variants: {
    label: "text-sm font-medium text-[var(--ggc-muted)] mb-2",
    option: "text-sm text-[var(--ggc-text)]"
  },

  button: {
    primary: "font-body text-sm font-semibold uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2",
    secondary: "font-body text-sm font-semibold uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2"
  },

  sizeChart: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4",
    tableHeader: "text-xs font-medium uppercase text-[var(--ggc-muted)]",
    tableCell: "text-sm text-[var(--ggc-muted)]"
  },

  faq: {
    question: "text-base font-semibold text-[var(--ggc-text)]",
    answer: "text-base text-[var(--ggc-muted)]"
  }
};
