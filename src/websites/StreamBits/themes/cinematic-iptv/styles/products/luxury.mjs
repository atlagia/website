export const luxuryProductStyle = {
  title: "font-display text-3xl font-light tracking-wide mb-2 text-[var(--sbi-text)]",
  price: "font-body text-2xl font-light tracking-wide text-[var(--sbi-text)]",

  breadcrumb: {
    link: "font-body text-sm text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150",
    current: "font-body text-sm font-medium text-[var(--sbi-text)]"
  },

  description: {
    title: "font-display text-xl font-light tracking-wide text-[var(--sbi-text)] mb-4",
    content: `
      font-body text-[var(--sbi-text)]
      [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-base
      [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[var(--sbi-text)] [&>h2]:mt-10 [&>h2]:mb-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[var(--sbi-glass-border)]
      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-[var(--sbi-text)] [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
      [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-[var(--sbi-text)] [&>h4]:mt-6 [&>h4]:mb-3
      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-[var(--sbi-muted)]
      [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-[var(--sbi-muted)]
      [&>strong]:font-bold [&>strong]:text-[var(--sbi-text)]
      [&>em]:italic
      [&>a]:text-[var(--sbi-accent)] [&>a]:underline [&>a:hover]:opacity-90
      [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--sbi-glass-border)] [&>blockquote]:italic [&>blockquote]:text-[var(--sbi-muted)] [&>blockquote]:my-6
      [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-4
      [&>table]:w-full [&>table]:border-collapse [&>table]:mb-6 [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:border [&>table]:border-[var(--sbi-glass-border)]
      [&>table>thead]:bg-[var(--sbi-glass-bg)] [&>table>thead>tr]:border-b [&>table>thead>tr]:border-[var(--sbi-glass-border)]
      [&>table>thead>tr>th]:px-6 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:text-[var(--sbi-text)] [&>table>thead>tr>th]:text-sm [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider
      [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-[var(--sbi-glass-border)] [&>table>tbody>tr:last-child]:border-b-0 [&>table>tbody>tr:hover]:bg-[var(--sbi-glass-bg)]
      [&>table>tbody>tr>td]:px-6 [&>table>tbody>tr>td]:py-4 [&>table>tbody>tr>td]:text-sm [&>table>tbody>tr>td]:text-[var(--sbi-muted)] [&>table>tbody>tr>td]:whitespace-normal
      [&>table>tbody>tr>td:first-child]:font-medium [&>table>tbody>tr>td:first-child]:text-[var(--sbi-text)]
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    `
  },

  specs: {
    title: "font-display text-xl font-light tracking-wide text-[var(--sbi-text)] mb-4",
    label: "font-body text-sm text-[var(--sbi-muted)]",
    value: "font-body text-sm text-[var(--sbi-text)]"
  },

  reviews: {
    title: "font-display text-xl font-light tracking-wide text-[var(--sbi-text)] mb-4",
    author: "font-body text-sm font-medium text-[var(--sbi-text)]",
    date: "font-body text-sm text-[var(--sbi-muted)]",
    content: "font-body text-base font-light text-[var(--sbi-muted)]"
  },

  related: {
    title: "font-display text-2xl font-light tracking-wide text-[var(--sbi-text)] mb-6",
    productTitle: "font-body text-base font-light text-[var(--sbi-text)]",
    productPrice: "font-body text-sm font-light text-[var(--sbi-muted)]"
  },

  variants: {
    label: "font-body text-sm text-[var(--sbi-muted)] mb-2",
    option: "font-body text-sm text-[var(--sbi-text)]"
  },

  button: {
    primary: "font-body text-sm font-medium tracking-wider uppercase transition-all duration-150",
    secondary: "font-body text-sm font-medium tracking-wider uppercase transition-all duration-150"
  },

  sizeChart: {
    title: "font-display text-xl font-light tracking-wide text-[var(--sbi-text)] mb-4",
    tableHeader: "font-body text-sm font-medium text-[var(--sbi-muted)]",
    tableCell: "font-body text-sm font-light text-[var(--sbi-text)]"
  },

  faq: {
    question: "font-body text-base font-medium text-[var(--sbi-text)]",
    answer: "font-body text-base font-light text-[var(--sbi-muted)]"
  }
};
