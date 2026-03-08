export const luxuryProductStyle = {
  title: "font-display text-3xl font-semibold tracking-tight text-neutral-900 mb-2 uppercase",
  price: "font-body text-2xl font-medium tracking-wide text-neutral-900",

  breadcrumb: {
    link: "font-body text-[11px] tracking-[0.2em] text-neutral-500 hover:text-neutral-900",
    current: "font-body text-[11px] font-medium tracking-[0.2em] text-neutral-900"
  },

  description: {
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    content: `
      font-body text-neutral-700
      [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-base
      [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-semibold [&>h2]:text-neutral-900 [&>h2]:mt-10 [&>h2]:mb-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-neutral-200
      [&>h3]:text-xl [&>h3]:font-display [&>h3]:font-semibold [&>h3]:text-neutral-900 [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
      [&>h4]:text-lg [&>h4]:font-display [&>h4]:font-semibold [&>h4]:text-neutral-900 [&>h4]:mt-6 [&>h4]:mb-3
      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-neutral-600
      [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-neutral-600
      [&>strong]:font-bold [&>strong]:text-neutral-900
      [&>em]:italic
      [&>a]:text-neutral-900 [&>a]:underline [&>a:hover]:text-neutral-700
      [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-neutral-200 [&>blockquote]:italic [&>blockquote]:text-neutral-600 [&>blockquote]:my-6
      [&>img]:rounded-lg [&>img]:my-4
      [&>table]:w-full [&>table]:border-collapse [&>table]:mb-6 [&>table]:bg-white [&>table]:border [&>table]:border-neutral-200 [&>table]:rounded-lg [&>table]:overflow-hidden
      [&>table>thead]:bg-neutral-50 [&>table>thead>tr]:border-b [&>table>thead>tr]:border-neutral-200
      [&>table>thead>tr>th]:px-6 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-display [&>table>thead>tr>th]:text-neutral-900 [&>table>thead>tr>th]:text-xs [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider
      [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-neutral-200 [&>table>tbody>tr]:last:border-b-0 [&>table>tbody>tr:hover]:bg-neutral-50
      [&>table>tbody>tr>td]:px-6 [&>table>tbody>tr>td]:py-4 [&>table>tbody>tr>td]:text-sm [&>table>tbody>tr>td]:text-neutral-600 [&>table>tbody>tr>td]:whitespace-normal
      [&>table>tbody>tr>td:first-child]:font-medium [&>table>tbody>tr>td:first-child]:text-neutral-900
      [&>table>tfoot]:bg-neutral-50 [&>table>tfoot>tr]:border-t [&>table>tfoot>tr]:border-neutral-200 [&>table>tfoot>tr>td]:px-6 [&>table>tfoot>tr>td]:py-3 [&>table>tfoot>tr>td]:text-sm [&>table>tfoot>tr>td]:font-semibold [&>table>tfoot>tr>td]:text-neutral-900
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    `
  },

  specs: {
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    label: "font-body text-sm font-medium text-neutral-600",
    value: "font-body text-sm text-neutral-900"
  },

  reviews: {
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    author: "font-display text-sm font-semibold text-neutral-900",
    date: "font-body text-sm text-neutral-500",
    content: "font-body text-base text-neutral-600"
  },

  related: {
    title: "font-display text-2xl font-semibold tracking-tight text-neutral-900 mb-6 uppercase",
    productTitle: "font-display text-base font-semibold tracking-wide text-neutral-900",
    productPrice: "font-body text-sm text-neutral-600"
  },

  variants: {
    label: "font-body text-sm font-medium text-neutral-600 mb-2 uppercase tracking-[0.08em]",
    option: "font-body text-sm text-neutral-900"
  },

  button: {
    primary: "font-display text-sm font-semibold tracking-[0.2em] uppercase",
    secondary: "font-display text-sm font-semibold tracking-[0.2em] uppercase"
  },

  sizeChart: {
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    tableHeader: "font-body text-xs font-medium uppercase tracking-wider text-neutral-600",
    tableCell: "font-body text-sm text-neutral-600"
  },

  faq: {
    question: "font-display text-base font-semibold tracking-wide text-neutral-900",
    answer: "font-body text-base text-neutral-600"
  }
};
