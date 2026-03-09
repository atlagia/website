export const luxuryProductStyle = {
  title: "font-display text-3xl font-medium tracking-tight text-[var(--luxury-black)] mb-2",
  price: "font-body text-2xl font-medium tracking-wide text-[var(--luxury-black)]",

  breadcrumb: {
    link: "font-body text-sm text-[var(--luxury-text)]/70 hover:text-[var(--luxury-black)]",
    current: "font-body text-sm font-medium text-[var(--luxury-black)]"
  },

  description: {
    title: "font-display text-xl font-medium tracking-wide text-[var(--luxury-black)] mb-4",
    content: `
      font-body text-[var(--luxury-text)]
      [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-base
      [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-medium [&>h2]:text-[var(--luxury-black)] [&>h2]:mt-10 [&>h2]:mb-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[var(--luxury-beige)]
      [&>h3]:text-xl [&>h3]:font-display [&>h3]:font-medium [&>h3]:text-[var(--luxury-black)] [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
      [&>h4]:text-lg [&>h4]:font-display [&>h4]:font-medium [&>h4]:text-[var(--luxury-black)] [&>h4]:mt-6 [&>h4]:mb-3
      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-[var(--luxury-text)]
      [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-[var(--luxury-text)]
      [&>strong]:font-semibold [&>strong]:text-[var(--luxury-black)]
      [&>em]:italic
      [&>a]:text-[var(--luxury-gold)] [&>a]:underline [&>a:hover]:text-[var(--luxury-black)]
      [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--luxury-beige)] [&>blockquote]:italic [&>blockquote]:text-[var(--luxury-text)] [&>blockquote]:my-6
      [&>img]:rounded-lg [&>img]:my-4
      [&>table]:w-full [&>table]:border-collapse [&>table]:mb-6 [&>table]:bg-[var(--luxury-ivory)] [&>table]:border [&>table]:border-[var(--luxury-beige)] [&>table]:rounded-lg [&>table]:overflow-hidden
      [&>table>thead]:bg-[var(--luxury-beige)]/30 [&>table>thead>tr]:border-b [&>table>thead>tr]:border-[var(--luxury-beige)]
      [&>table>thead>tr>th]:px-6 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-display [&>table>thead>tr>th]:text-[var(--luxury-black)] [&>table>thead>tr>th]:text-xs [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider
      [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-[var(--luxury-beige)] [&>table>tbody>tr]:last:border-b-0 [&>table>tbody>tr:hover]:bg-[var(--luxury-beige)]/10
      [&>table>tbody>tr>td]:px-6 [&>table>tbody>tr>td]:py-4 [&>table>tbody>tr>td]:text-sm [&>table>tbody>tr>td]:text-[var(--luxury-text)]
      [&>table>tbody>tr>td:first-child]:font-medium [&>table>tbody>tr>td:first-child]:text-[var(--luxury-black)]
      [&>table>tfoot]:bg-[var(--luxury-beige)]/20 [&>table>tfoot>tr]:border-t [&>table>tfoot>tr]:border-[var(--luxury-beige)] [&>table>tfoot>tr>td]:px-6 [&>table>tfoot>tr>td]:py-3 [&>table>tfoot>tr>td]:text-sm [&>table>tfoot>tr>td]:font-semibold [&>table>tfoot>tr>td]:text-[var(--luxury-black)]
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    `
  },

  specs: {
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    label: "font-body text-sm font-medium text-[var(--luxury-text)]/70",
    value: "font-body text-sm text-[var(--luxury-black)]"
  },

  reviews: {
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    author: "font-display text-sm font-medium text-[var(--luxury-black)]",
    date: "font-body text-sm text-[var(--luxury-text)]/60",
    content: "font-body text-base text-[var(--luxury-text)]"
  },

  related: {
    title: "font-display text-2xl font-medium text-[var(--luxury-black)] mb-6",
    productTitle: "font-display text-base font-medium text-[var(--luxury-black)]",
    productPrice: "font-body text-sm text-[var(--luxury-text)]"
  },

  variants: {
    label: "font-body text-sm font-medium text-[var(--luxury-text)] mb-2",
    option: "font-body text-sm text-[var(--luxury-text)]"
  },

  button: {
    primary: "font-body text-[11px] font-medium tracking-[0.2em] uppercase",
    secondary: "font-body text-[11px] font-medium tracking-[0.2em] uppercase"
  },

  sizeChart: {
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    tableHeader: "font-body text-sm font-medium text-[var(--luxury-text)]",
    tableCell: "font-body text-sm text-[var(--luxury-text)]"
  },

  faq: {
    question: "font-display text-base font-medium text-[var(--luxury-black)]",
    answer: "font-body text-base text-[var(--luxury-text)]"
  }
}; 