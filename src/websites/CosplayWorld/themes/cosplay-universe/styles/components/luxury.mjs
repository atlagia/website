export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-[var(--cw-card)] border border-[var(--cw-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--cw-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--cw-bg)] rounded-xl p-4 border border-[var(--cw-border)] hover:border-[var(--cw-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--cw-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--cw-text)]",
    textWrap: "flex-1",
    text: "font-body text-sm text-[var(--cw-muted)] leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--cw-muted)] bg-[var(--cw-bg)] px-4 py-2 border border-[var(--cw-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--cw-muted)]"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-[var(--cw-card)] border border-[var(--cw-border)] rounded-2xl p-6 shadow-sm",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--cw-text)] mb-4",
    list: "space-y-4",
    item: "border-b border-[var(--cw-border)] last:border-0 pb-4 last:pb-0",
    question: "font-body text-sm font-medium text-[var(--cw-text)] mb-2 uppercase tracking-[0.06em]",
    answer: "font-body text-sm text-[var(--cw-muted)]"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--cw-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--cw-surface)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--cw-surface)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--cw-surface)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--cw-surface)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--cw-surface)] rounded"
    }
  },

  // Product Specs styles
  specs: {
    wrapper: "bg-[var(--cw-card)] border border-[var(--cw-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--cw-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--cw-bg)] rounded-xl p-4 border border-[var(--cw-border)] hover:border-[var(--cw-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--cw-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--cw-text)]",
    itemBody: "flex-1 min-w-0",
    label: "text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--cw-muted)] mb-1",
    value: "text-sm font-medium text-[var(--cw-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--cw-muted)] bg-[var(--cw-bg)] px-4 py-2 border border-[var(--cw-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--cw-muted)]"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t border-[var(--cw-border)] pt-8",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--cw-text)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--cw-card)] rounded-xl p-5 border border-[var(--cw-border)] hover:border-[var(--cw-text)]/30 transition-colors mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--cw-surface)] rounded-full flex items-center justify-center",
      avatarText: "text-[var(--cw-text)] font-semibold text-sm",
      authorInfo: {
        name: "font-body font-medium text-[var(--cw-text)]",
        meta: "text-sm text-[var(--cw-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-[0.1em] font-medium bg-[var(--cw-surface)] text-[var(--cw-text)] border border-[var(--cw-border)]"
      },
      rating: "flex text-[var(--cw-accent)] text-sm",
      content: "font-body text-sm text-[var(--cw-muted)] leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-[var(--cw-border)] rounded-sm text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--cw-text)] bg-[var(--cw-bg)] hover:bg-[var(--cw-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--cw-text)] focus:ring-offset-2 transition-colors duration-200"
    }
  },

  // Size Chart styles
  sizeChart: {
    wrapper: "bg-[var(--cw-card)] rounded-2xl p-6 border border-[var(--cw-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--cw-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "h-4 w-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)]",
    tableCard: "bg-[var(--cw-bg)] rounded-xl border border-[var(--cw-border)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--cw-surface)] border-b border-[var(--cw-border)]",
      headerCell: "px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--cw-muted)]",
      body: "divide-y divide-[var(--cw-border)]",
      row: "hover:bg-[var(--cw-surface)]/40 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-sm text-[var(--cw-muted)]",
      firstCell: "font-medium text-[var(--cw-text)]"
    },
    tips: {
      wrapper: "mt-6 bg-[var(--cw-bg)] rounded-xl p-5 border border-[var(--cw-border)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--cw-surface)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--cw-text)]",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-[var(--cw-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--cw-surface)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--cw-text)]",
      listText: "text-sm text-[var(--cw-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--cw-muted)] bg-[var(--cw-bg)] px-4 py-2 border border-[var(--cw-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--cw-muted)]"
  },

  recentlyViewed: {
    wrapper: "bg-[var(--cw-card)] rounded-2xl p-6 border border-[var(--cw-border)]",
    header: "flex items-center justify-between mb-4",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--cw-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    clearButton: "text-[11px] uppercase tracking-[0.12em] text-[var(--cw-muted)] hover:text-[var(--cw-text)] underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--cw-muted)] mb-3",
    emptyText: "text-[var(--cw-muted)] text-sm",
    card: "bg-[var(--cw-bg)] rounded-lg border border-[var(--cw-border)] hover:border-[var(--cw-text)]/30 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--cw-surface)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--cw-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--cw-text)]",
    cardRemove: "text-xs text-[var(--cw-muted)] hover:text-[var(--cw-text)]"
  },

  shipping: {
    wrapper: "bg-[var(--cw-card)] rounded-2xl p-6 border border-[var(--cw-border)]",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--cw-text)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-[var(--cw-bg)] border border-[var(--cw-border)] rounded-xl",
    methodTitle: "text-sm font-medium text-[var(--cw-text)] mb-1",
    methodPrice: "text-xs text-[var(--cw-muted)]",
    methodEta: "text-xs text-[var(--cw-muted)] mt-1",
    footnoteWrap: "text-center text-sm text-[var(--cw-muted)]"
  },

  warranty: {
    wrapper: "bg-[var(--cw-card)] rounded-2xl p-6 border border-[var(--cw-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--cw-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-[var(--cw-bg)] rounded-xl p-5 border border-[var(--cw-border)]",
    cardTitle: "font-medium text-[var(--cw-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--cw-surface)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--cw-text)]",
    listText: "text-[var(--cw-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-[var(--cw-bg)] rounded-xl border border-[var(--cw-border)]",
    noteText: "text-sm text-[var(--cw-muted)] text-center",
    noteStrong: "font-medium text-[var(--cw-text)]"
  },

  careInstructions: {
    wrapper: "bg-[var(--cw-surface)] border border-[var(--cw-border)] rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-sm font-semibold uppercase tracking-wide text-[var(--cw-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--cw-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--cw-text)]",
    titleDivider: "w-12 h-px bg-[var(--cw-border)] mt-2",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    column: "space-y-3",
    heading: "font-semibold text-[var(--cw-text)] text-sm",
    list: "space-y-2 text-sm text-[var(--cw-muted)]",
    listItem: "flex items-start",
    bullet: "w-1.5 h-1.5 bg-[var(--cw-muted)] rounded-full mt-2 mr-3 flex-shrink-0"
  }
}; 