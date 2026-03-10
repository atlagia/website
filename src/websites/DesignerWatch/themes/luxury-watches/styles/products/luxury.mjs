/**
 * Product page luxury styles. Core uses: luxuryProductStyle.title, .breadcrumb.link|.current, .related.title
 * Include all keys so new stores can override any of them.
 */
export const luxuryProductStyle = {
  title: "text-3xl font-light tracking-wide mb-2 text-[var(--dw-text)] font-display",
  price: "text-2xl font-medium text-[var(--dw-accent)]",

  breadcrumb: {
    link: "text-sm text-[var(--dw-muted)] hover:text-[var(--dw-text)]",
    current: "text-sm font-medium text-[var(--dw-text)]"
  },

  description: {
    title: "text-xl font-semibold tracking-wide text-[var(--dw-text)] mb-4 font-display",
    content: "text-[var(--dw-muted)] [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>strong]:font-bold [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
  },

  specs: {
    title: "text-xl font-semibold tracking-wide text-[var(--dw-text)] mb-4 font-display",
    label: "text-sm font-medium text-[var(--dw-muted)]",
    value: "text-sm text-[var(--dw-text)]"
  },

  reviews: {
    title: "text-xl font-semibold tracking-wide text-[var(--dw-text)] mb-4 font-display",
    author: "text-sm font-medium text-[var(--dw-text)]",
    date: "text-sm text-[var(--dw-muted)]",
    content: "text-base text-[var(--dw-muted)]"
  },

  related: {
    title: "text-2xl font-light tracking-wide text-[var(--dw-text)] mb-6 font-display",
    productTitle: "text-base font-medium text-[var(--dw-text)]",
    productPrice: "text-sm text-[var(--dw-accent)]"
  },

  variants: {
    label: "text-sm font-medium text-[var(--dw-muted)] mb-2",
    option: "text-sm text-[var(--dw-text)]"
  },

  button: {
    primary: "text-sm font-semibold uppercase tracking-wide bg-[var(--dw-accent)] text-[var(--dw-bg)] hover:opacity-95",
    secondary: "text-sm font-semibold uppercase tracking-wide border border-[var(--dw-border)] text-[var(--dw-text)]"
  },

  sizeChart: {
    title: "text-xl font-semibold tracking-wide text-[var(--dw-text)] mb-4 font-display",
    tableHeader: "text-xs font-medium uppercase text-[var(--dw-muted)]",
    tableCell: "text-sm text-[var(--dw-muted)]"
  },

  faq: {
    question: "text-base font-semibold text-[var(--dw-text)] font-display",
    answer: "text-base text-[var(--dw-muted)]"
  }
};
