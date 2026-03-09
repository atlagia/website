/**
 * Product page luxury styles. Core uses: luxuryProductStyle.title, .breadcrumb.link|.current, .related.title
 * Include all keys so new stores can override any of them.
 */
export const luxuryProductStyle = {
  title: "text-3xl font-light tracking-wide mb-2 text-neutral-900",
  price: "text-2xl font-medium text-neutral-900",

  breadcrumb: {
    link: "text-sm text-neutral-600 hover:text-neutral-900",
    current: "text-sm font-medium text-neutral-900"
  },

  description: {
    title: "text-xl font-semibold tracking-wide text-neutral-900 mb-4",
    content: "text-neutral-700 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>strong]:font-bold [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
  },

  specs: {
    title: "text-xl font-semibold tracking-wide text-neutral-900 mb-4",
    label: "text-sm font-medium text-neutral-600",
    value: "text-sm text-neutral-900"
  },

  reviews: {
    title: "text-xl font-semibold tracking-wide text-neutral-900 mb-4",
    author: "text-sm font-medium text-neutral-900",
    date: "text-sm text-neutral-500",
    content: "text-base text-neutral-600"
  },

  related: {
    title: "text-2xl font-light tracking-wide text-neutral-900 mb-6",
    productTitle: "text-base font-medium text-neutral-900",
    productPrice: "text-sm text-neutral-600"
  },

  variants: {
    label: "text-sm font-medium text-neutral-600 mb-2",
    option: "text-sm text-neutral-900"
  },

  button: {
    primary: "text-sm font-semibold uppercase",
    secondary: "text-sm font-semibold uppercase"
  },

  sizeChart: {
    title: "text-xl font-semibold tracking-wide text-neutral-900 mb-4",
    tableHeader: "text-xs font-medium uppercase text-neutral-600",
    tableCell: "text-sm text-neutral-600"
  },

  faq: {
    question: "text-base font-semibold text-neutral-900",
    answer: "text-base text-neutral-600"
  }
};
