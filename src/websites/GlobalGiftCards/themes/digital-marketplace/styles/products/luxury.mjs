/**
 * Product page luxury styles. GlobalGiftCards digital-marketplace — premium token-based.
 * Fluid typography (clamp), WCAG 2.2 contrast, microinteractions 120–200ms.
 */
export const luxuryProductStyle = {
  title: "font-display text-[clamp(1.5rem,4vw,1.875rem)] font-semibold tracking-tight text-[var(--ggc-text)] mb-2 dark:text-[var(--ggc-dark-text)]",

  price: "font-display text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]",

  breadcrumb: {
    link: "font-body text-[clamp(0.8125rem,1.5vw,0.875rem)] text-[var(--ggc-muted)] hover:text-[var(--ggc-accent)] transition-colors duration-150 dark:text-[var(--ggc-dark-muted)] dark:hover:text-[var(--ggc-dark-accent)]",
    current: "font-body text-[clamp(0.8125rem,1.5vw,0.875rem)] font-medium text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]"
  },

  description: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4 dark:text-[var(--ggc-dark-text)]",
    content: "text-[var(--ggc-text)] [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>strong]:font-bold [&>a]:text-[var(--ggc-accent)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 dark:text-[var(--ggc-dark-text)] dark:[&>a]:text-[var(--ggc-dark-accent)]"
  },

  specs: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4 dark:text-[var(--ggc-dark-text)]",
    label: "text-sm font-medium text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]",
    value: "text-sm text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]"
  },

  reviews: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4 dark:text-[var(--ggc-dark-text)]",
    author: "text-sm font-medium text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]",
    date: "text-sm text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]",
    content: "text-base text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]"
  },

  related: {
    title: "font-display text-[clamp(1.25rem,3vw,1.5rem)] font-semibold tracking-tight text-[var(--ggc-text)] mb-6 dark:text-[var(--ggc-dark-text)]",
    productTitle: "text-base font-medium text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]",
    productPrice: "text-sm text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]"
  },

  variants: {
    label: "text-sm font-medium text-[var(--ggc-muted)] mb-2 dark:text-[var(--ggc-dark-muted)]",
    option: "text-sm text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]"
  },

  button: {
    primary: "font-body text-sm font-semibold uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2 dark:text-[var(--ggc-dark-text)] dark:focus-visible:ring-[var(--ggc-dark-accent)]",
    secondary: "font-body text-sm font-semibold uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2 dark:text-[var(--ggc-dark-text)] dark:focus-visible:ring-[var(--ggc-dark-accent)]"
  },

  sizeChart: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ggc-text)] mb-4 dark:text-[var(--ggc-dark-text)]",
    tableHeader: "text-xs font-medium uppercase text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]",
    tableCell: "text-sm text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]"
  },

  faq: {
    question: "text-base font-semibold text-[var(--ggc-text)] dark:text-[var(--ggc-dark-text)]",
    answer: "text-base text-[var(--ggc-muted)] dark:text-[var(--ggc-dark-muted)]"
  }
};
