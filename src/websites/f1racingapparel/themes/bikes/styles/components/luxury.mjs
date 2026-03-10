export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-[var(--drivon-card)] border border-[var(--drivon-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--drivon-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--drivon-text)]",
    titleDivider: "w-12 h-px bg-[var(--drivon-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--drivon-bg)] rounded-xl p-4 border border-[var(--drivon-border)] hover:border-[var(--drivon-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--drivon-text)]",
    textWrap: "flex-1",
    text: "font-body text-sm text-[var(--drivon-muted)] leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--drivon-muted)] bg-[var(--drivon-bg)] px-4 py-2 border border-[var(--drivon-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--drivon-muted)]"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-[var(--drivon-card)] border border-[var(--drivon-border)] rounded-2xl p-6 shadow-sm",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--drivon-text)] mb-4",
    list: "space-y-4",
    item: "border-b border-[var(--drivon-border)] last:border-0 pb-4 last:pb-0",
    question: "font-body text-sm font-medium text-[var(--drivon-text)] mb-2 uppercase tracking-[0.06em]",
    answer: "font-body text-sm text-[var(--drivon-muted)]"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--drivon-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--drivon-surface)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--drivon-surface)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--drivon-surface)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--drivon-surface)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--drivon-surface)] rounded"
    }
  },

  // Product Specs styles
  specs: {
    wrapper: "bg-[var(--drivon-card)] border border-[var(--drivon-border)] rounded-2xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--drivon-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--drivon-text)]",
    titleDivider: "w-12 h-px bg-[var(--drivon-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-[var(--drivon-bg)] rounded-xl p-4 border border-[var(--drivon-border)] hover:border-[var(--drivon-text)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-3",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--drivon-text)]",
    itemBody: "flex-1 min-w-0",
    label: "text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--drivon-muted)] mb-1",
    value: "text-sm font-medium text-[var(--drivon-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--drivon-muted)] bg-[var(--drivon-bg)] px-4 py-2 border border-[var(--drivon-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--drivon-muted)]"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t border-[var(--drivon-border)] pt-8",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--drivon-text)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--drivon-card)] rounded-xl p-5 border border-[var(--drivon-border)] hover:border-[var(--drivon-text)]/30 transition-colors mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center",
      avatarText: "text-[var(--drivon-text)] font-semibold text-sm",
      authorInfo: {
        name: "font-body font-medium text-[var(--drivon-text)]",
        meta: "text-sm text-[var(--drivon-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-[0.1em] font-medium bg-[var(--drivon-surface)] text-[var(--drivon-text)] border border-[var(--drivon-border)]"
      },
      rating: "flex text-[var(--drivon-accent)] text-sm",
      content: "font-body text-sm text-[var(--drivon-muted)] leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-[var(--drivon-border)] rounded-sm text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--drivon-text)] bg-[var(--drivon-bg)] hover:bg-[var(--drivon-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--drivon-text)] focus:ring-offset-2 transition-colors duration-200"
    }
  },

  // Size Chart styles
  sizeChart: {
    wrapper: "bg-[var(--drivon-card)] rounded-2xl p-6 border border-[var(--drivon-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-lg font-bold uppercase tracking-tight text-[var(--drivon-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "h-4 w-4 text-[var(--drivon-text)]",
    titleDivider: "w-12 h-px bg-[var(--drivon-border)]",
    tableCard: "bg-[var(--drivon-bg)] rounded-xl border border-[var(--drivon-border)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--drivon-surface)] border-b border-[var(--drivon-border)]",
      headerCell: "px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--drivon-muted)]",
      body: "divide-y divide-[var(--drivon-border)]",
      row: "hover:bg-[var(--drivon-surface)]/40 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-sm text-[var(--drivon-muted)]",
      firstCell: "font-medium text-[var(--drivon-text)]"
    },
    tips: {
      wrapper: "mt-6 bg-[var(--drivon-bg)] rounded-xl p-5 border border-[var(--drivon-border)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--drivon-text)]",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-[var(--drivon-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--drivon-text)]",
      listText: "text-sm text-[var(--drivon-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--drivon-muted)] bg-[var(--drivon-bg)] px-4 py-2 border border-[var(--drivon-border)] rounded-sm",
    footerIcon: "w-4 h-4 text-[var(--drivon-muted)]"
  },

  recentlyViewed: {
    wrapper: "bg-[var(--drivon-card)] rounded-2xl p-6 border border-[var(--drivon-border)]",
    header: "flex items-center justify-between mb-4",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--drivon-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--drivon-text)]",
    clearButton: "text-[11px] uppercase tracking-[0.12em] text-[var(--drivon-muted)] hover:text-[var(--drivon-text)] underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--drivon-muted)] mb-3",
    emptyText: "text-[var(--drivon-muted)] text-sm",
    card: "bg-[var(--drivon-bg)] rounded-lg border border-[var(--drivon-border)] hover:border-[var(--drivon-text)]/30 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--drivon-surface)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--drivon-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--drivon-text)]",
    cardRemove: "text-xs text-[var(--drivon-muted)] hover:text-[var(--drivon-text)]"
  },

  shipping: {
    wrapper: "bg-[var(--drivon-card)] rounded-2xl p-6 border border-[var(--drivon-border)]",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--drivon-text)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--drivon-text)]",
    titleDivider: "w-12 h-px bg-[var(--drivon-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-[var(--drivon-bg)] border border-[var(--drivon-border)] rounded-xl",
    methodTitle: "text-sm font-medium text-[var(--drivon-text)] mb-1",
    methodPrice: "text-xs text-[var(--drivon-muted)]",
    methodEta: "text-xs text-[var(--drivon-muted)] mt-1",
    footnoteWrap: "text-center text-sm text-[var(--drivon-muted)]"
  },

  warranty: {
    wrapper: "bg-[var(--drivon-card)] rounded-2xl p-6 border border-[var(--drivon-border)]",
    headerWrap: "mb-6",
    title: "font-headline text-base font-semibold uppercase tracking-[0.08em] text-[var(--drivon-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--drivon-surface)] rounded-md flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--drivon-text)]",
    titleDivider: "w-12 h-px bg-[var(--drivon-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-[var(--drivon-bg)] rounded-xl p-5 border border-[var(--drivon-border)]",
    cardTitle: "font-medium text-[var(--drivon-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--drivon-surface)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--drivon-text)]",
    listText: "text-[var(--drivon-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-[var(--drivon-bg)] rounded-xl border border-[var(--drivon-border)]",
    noteText: "text-sm text-[var(--drivon-muted)] text-center",
    noteStrong: "font-medium text-[var(--drivon-text)]"
  },

  careInstructions: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-headline text-sm font-semibold uppercase tracking-wide text-neutral-700 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200 mt-2",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    column: "space-y-3",
    heading: "font-semibold text-neutral-900 text-sm",
    list: "space-y-2 text-sm text-neutral-600",
    listItem: "flex items-start",
    bullet: "w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 mr-3 flex-shrink-0"
  }
}; 