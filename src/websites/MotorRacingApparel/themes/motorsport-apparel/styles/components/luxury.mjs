export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-[var(--mra-card)] border border-[var(--mra-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--mra-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--mra-text)]",
    titleDivider: "w-12 h-px bg-[var(--mra-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--mra-bg)] rounded-xl p-4 border border-[var(--mra-border)] hover:border-[var(--mra-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--mra-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--mra-text)]",
    textWrap: "flex-1",
    text: "font-body text-sm text-[var(--mra-muted)] leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--mra-muted)] bg-[var(--mra-bg)] px-4 py-2 border border-[var(--mra-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--mra-muted)]"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-[var(--mra-card)] border border-[var(--mra-border)] rounded-2xl p-6 shadow-sm",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--mra-text)] mb-4",
    list: "space-y-4",
    item: "border-b border-[var(--mra-border)] last:border-0 pb-4 last:pb-0",
    question: "font-body text-sm font-medium text-[var(--mra-text)] mb-2 uppercase tracking-[0.06em]",
    answer: "font-body text-sm text-[var(--mra-muted)]"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--mra-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--mra-surface)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--mra-surface)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--mra-surface)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--mra-surface)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--mra-surface)] rounded"
    }
  },

  // Product Specs styles
  specs: {
    wrapper: "bg-[var(--mra-card)] border border-[var(--mra-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--mra-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--mra-text)]",
    titleDivider: "w-12 h-px bg-[var(--mra-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--mra-bg)] rounded-xl p-4 border border-[var(--mra-border)] hover:border-[var(--mra-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--mra-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--mra-text)]",
    itemBody: "flex-1 min-w-0",
    label: "text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--mra-muted)] mb-1",
    value: "text-sm font-medium text-[var(--mra-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--mra-muted)] bg-[var(--mra-bg)] px-4 py-2 border border-[var(--mra-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--mra-muted)]"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t border-[var(--mra-border)] pt-8",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--mra-text)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--mra-card)] rounded-xl p-5 border border-[var(--mra-border)] hover:border-[var(--mra-text)]/30 transition-colors mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--mra-surface)] rounded-full flex items-center justify-center",
      avatarText: "text-[var(--mra-text)] font-semibold text-sm",
      authorInfo: {
        name: "font-body font-medium text-[var(--mra-text)]",
        meta: "text-sm text-[var(--mra-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-[0.1em] font-medium bg-[var(--mra-surface)] text-[var(--mra-text)] border border-[var(--mra-border)]"
      },
      rating: "flex text-[var(--mra-accent)] text-sm",
      content: "font-body text-sm text-[var(--mra-muted)] leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-[var(--mra-border)] rounded-sm text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--mra-text)] bg-[var(--mra-bg)] hover:bg-[var(--mra-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--mra-text)] focus:ring-offset-2 transition-colors duration-200"
    }
  },

  // Size Chart styles
  sizeChart: {
    wrapper: "bg-[var(--mra-card)] rounded-2xl p-6 border border-[var(--mra-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--mra-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "h-4 w-4 text-[var(--mra-text)]",
    titleDivider: "w-12 h-px bg-[var(--mra-border)]",
    tableCard: "bg-[var(--mra-bg)] rounded-xl border border-[var(--mra-border)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--mra-surface)] border-b border-[var(--mra-border)]",
      headerCell: "px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--mra-muted)]",
      body: "divide-y divide-[var(--mra-border)]",
      row: "hover:bg-[var(--mra-surface)]/40 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-sm text-[var(--mra-muted)]",
      firstCell: "font-medium text-[var(--mra-text)]"
    },
    tips: {
      wrapper: "mt-6 bg-[var(--mra-bg)] rounded-xl p-5 border border-[var(--mra-border)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--mra-surface)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--mra-text)]",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-[var(--mra-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--mra-surface)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--mra-text)]",
      listText: "text-sm text-[var(--mra-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--mra-muted)] bg-[var(--mra-bg)] px-4 py-2 border border-[var(--mra-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--mra-muted)]"
  },

  recentlyViewed: {
    wrapper: "bg-[var(--mra-card)] rounded-2xl p-6 border border-[var(--mra-border)]",
    header: "flex items-center justify-between mb-4",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--mra-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--mra-text)]",
    clearButton: "text-[11px] uppercase tracking-[0.12em] text-[var(--mra-muted)] hover:text-[var(--mra-text)] underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--mra-muted)] mb-3",
    emptyText: "text-[var(--mra-muted)] text-sm",
    card: "bg-[var(--mra-bg)] rounded-lg border border-[var(--mra-border)] hover:border-[var(--mra-text)]/30 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--mra-surface)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--mra-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--mra-text)]",
    cardRemove: "text-xs text-[var(--mra-muted)] hover:text-[var(--mra-text)]"
  },

  shipping: {
    wrapper: "bg-[var(--mra-card)] rounded-2xl p-6 border border-[var(--mra-border)]",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--mra-text)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--mra-text)]",
    titleDivider: "w-12 h-px bg-[var(--mra-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-[var(--mra-bg)] border border-[var(--mra-border)] rounded-xl",
    methodTitle: "text-sm font-medium text-[var(--mra-text)] mb-1",
    methodPrice: "text-xs text-[var(--mra-muted)]",
    methodEta: "text-xs text-[var(--mra-muted)] mt-1",
    footnoteWrap: "text-center text-sm text-[var(--mra-muted)]"
  },

  warranty: {
    wrapper: "bg-[var(--mra-card)] rounded-2xl p-6 border border-[var(--mra-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--mra-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--mra-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--mra-text)]",
    titleDivider: "w-12 h-px bg-[var(--mra-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-[var(--mra-bg)] rounded-xl p-5 border border-[var(--mra-border)]",
    cardTitle: "font-medium text-[var(--mra-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--mra-surface)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--mra-text)]",
    listText: "text-[var(--mra-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-[var(--mra-bg)] rounded-xl border border-[var(--mra-border)]",
    noteText: "text-sm text-[var(--mra-muted)] text-center",
    noteStrong: "font-medium text-[var(--mra-text)]"
  }
}; 