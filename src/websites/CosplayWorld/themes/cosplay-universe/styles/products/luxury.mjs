export const luxuryProductStyle = {
  title: "font-display text-3xl font-semibold tracking-tight text-[var(--cw-text)] mb-2 uppercase",
  price: "font-body text-2xl font-medium tracking-wide text-[var(--cw-text)]",

  breadcrumb: {
    link: "font-body text-[11px] tracking-[0.2em] text-[var(--cw-muted)] hover:text-[var(--cw-text)]",
    current: "font-body text-[11px] font-medium tracking-[0.2em] text-[var(--cw-text)]"
  },

  description: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--cw-text)] mb-4 uppercase",
    content: `
      font-body text-[var(--cw-text)]
      [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-base
      [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-semibold [&>h2]:text-[var(--cw-text)] [&>h2]:mt-10 [&>h2]:mb-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[var(--cw-border)]
      [&>h3]:text-xl [&>h3]:font-display [&>h3]:font-semibold [&>h3]:text-[var(--cw-text)] [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
      [&>h4]:text-lg [&>h4]:font-display [&>h4]:font-semibold [&>h4]:text-[var(--cw-text)] [&>h4]:mt-6 [&>h4]:mb-3
      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-[var(--cw-muted)]
      [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-[var(--cw-muted)]
      [&>strong]:font-bold [&>strong]:text-[var(--cw-text)]
      [&>em]:italic
      [&>a]:text-[var(--cw-text)] [&>a]:underline [&>a:hover]:text-[var(--cw-text)]
      [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--cw-border)] [&>blockquote]:italic [&>blockquote]:text-[var(--cw-muted)] [&>blockquote]:my-6
      [&>img]:rounded-lg [&>img]:my-4
      [&>table]:w-full [&>table]:border-collapse [&>table]:mb-6 [&>table]:bg-[var(--cw-surface)] [&>table]:border [&>table]:border-[var(--cw-border)] [&>table]:rounded-lg [&>table]:overflow-hidden
      [&>table>thead]:bg-[var(--cw-surface)] [&>table>thead>tr]:border-b [&>table>thead>tr]:border-[var(--cw-border)]
      [&>table>thead>tr>th]:px-6 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-display [&>table>thead>tr>th]:text-[var(--cw-text)] [&>table>thead>tr>th]:text-xs [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider
      [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-[var(--cw-border)] [&>table>tbody>tr]:last:border-b-0 [&>table>tbody>tr:hover]:bg-[var(--cw-surface)]
      [&>table>tbody>tr>td]:px-6 [&>table>tbody>tr>td]:py-4 [&>table>tbody>tr>td]:text-sm [&>table>tbody>tr>td]:text-[var(--cw-muted)] [&>table>tbody>tr>td]:whitespace-normal
      [&>table>tbody>tr>td:first-child]:font-medium [&>table>tbody>tr>td:first-child]:text-[var(--cw-text)]
      [&>table>tfoot]:bg-[var(--cw-surface)] [&>table>tfoot>tr]:border-t [&>table>tfoot>tr]:border-[var(--cw-border)] [&>table>tfoot>tr>td]:px-6 [&>table>tfoot>tr>td]:py-3 [&>table>tfoot>tr>td]:text-sm [&>table>tfoot>tr>td]:font-semibold [&>table>tfoot>tr>td]:text-[var(--cw-text)]
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    `
  },

  specs: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--cw-text)] mb-4 uppercase",
    label: "font-body text-sm font-medium text-[var(--cw-muted)]",
    value: "font-body text-sm text-[var(--cw-text)]"
  },

  reviews: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--cw-text)] mb-4 uppercase",
    author: "font-display text-sm font-semibold text-[var(--cw-text)]",
    date: "font-body text-sm text-[var(--cw-muted)]",
    content: "font-body text-base text-[var(--cw-muted)]"
  },

  related: {
    title: "font-display text-2xl font-semibold tracking-tight text-[var(--cw-text)] mb-6 uppercase",
    productTitle: "font-display text-base font-semibold tracking-wide text-[var(--cw-text)]",
    productPrice: "font-body text-sm text-[var(--cw-muted)]"
  },

  variants: {
    label: "font-body text-sm font-medium text-[var(--cw-muted)] mb-2 uppercase tracking-[0.08em]",
    option: "font-body text-sm text-[var(--cw-text)]"
  },

  button: {
    primary: "font-display text-sm font-semibold tracking-[0.2em] uppercase",
    secondary: "font-display text-sm font-semibold tracking-[0.2em] uppercase"
  },

  sizeChart: {
    title: "font-display text-xl font-semibold tracking-wide text-[var(--cw-text)] mb-4 uppercase",
    tableHeader: "font-body text-xs font-medium uppercase tracking-wider text-[var(--cw-muted)]",
    tableCell: "font-body text-sm text-[var(--cw-muted)]"
  },

  faq: {
    question: "font-display text-base font-semibold tracking-wide text-[var(--cw-text)]",
    answer: "font-body text-base text-[var(--cw-muted)]"
  }
};
