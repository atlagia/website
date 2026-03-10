/**
 * Shared component styles (ProductSpecs, RecentlyViewed, KeyFeatures, ProductFAQ, Reviews,
 * ProductLoading, ShippingInfo, ProductWarranty, SizeChart). Core merges these over defaults.
 * Include all params so new stores can override any key.
 */
export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-[var(--dw-bg)] rounded-xl p-5 border border-[var(--dw-border)] hover:border-[var(--dw-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--dw-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--dw-accent)]",
    textWrap: "flex-1",
    text: "text-[var(--dw-text)] font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--dw-muted)] bg-[var(--dw-surface)] px-4 py-2 border border-[var(--dw-border)]",
    footerIcon: "w-4 h-4 text-[var(--dw-muted)]"
  },

  faq: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)]",
    list: "space-y-4",
    item: "group bg-[var(--dw-bg)] rounded-xl border border-[var(--dw-border)] hover:border-[var(--dw-accent)]/30 transition-all duration-200 overflow-hidden",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--dw-surface)] rounded-full flex items-center justify-center",
    questionIconText: "text-[var(--dw-accent)] font-semibold text-sm",
    question: "text-base font-semibold text-[var(--dw-text)] mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-[var(--dw-surface)] rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "text-[var(--dw-accent)] font-semibold text-xs",
    answer: "text-[var(--dw-muted)] text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--dw-muted)] bg-[var(--dw-surface)] px-4 py-2 border border-[var(--dw-border)]",
    footerIcon: "w-4 h-4 text-[var(--dw-muted)]"
  },

  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--dw-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-gray-200 rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-gray-200 rounded w-3/4",
      subtitleLine: "h-4 bg-gray-200 rounded w-1/4",
      priceLine: "h-12 bg-gray-200 rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-gray-200 rounded"
    }
  },

  specs: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-[var(--dw-bg)] rounded-xl p-5 border border-[var(--dw-border)] hover:border-[var(--dw-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--dw-surface)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--dw-accent)]",
    itemBody: "flex-1 min-w-0",
    label: "text-xs font-semibold text-[var(--dw-muted)] uppercase tracking-wider mb-1",
    value: "text-base font-medium text-[var(--dw-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--dw-muted)] bg-[var(--dw-surface)] px-4 py-2 border border-[var(--dw-border)]",
    footerIcon: "w-4 h-4 text-[var(--dw-muted)]"
  },

  reviews: {
    wrapper: "border-t border-[var(--dw-border)] pt-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--dw-surface)] rounded-xl p-5 border border-[var(--dw-border)] hover:border-[var(--dw-accent)]/30 transition-colors mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--dw-bg)] rounded-full flex items-center justify-center",
      avatarText: "text-[var(--dw-text)] font-semibold text-sm",
      authorInfo: {
        name: "font-medium text-[var(--dw-text)]",
        meta: "text-sm text-[var(--dw-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--dw-bg)] text-[var(--dw-muted)] border border-[var(--dw-border)]"
      },
      rating: "flex text-[var(--dw-accent)] text-sm",
      content: "text-[var(--dw-muted)] text-sm leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-[var(--dw-border)] rounded text-sm font-medium text-[var(--dw-text)] bg-[var(--dw-surface)] hover:bg-[var(--dw-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)] focus:ring-offset-2 focus:ring-offset-[var(--dw-bg)] transition-colors"
    }
  },

  recentlyViewed: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    header: "flex items-center justify-between mb-4",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    clearButton: "text-sm text-[var(--dw-muted)] hover:text-[var(--dw-text)] underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--dw-muted)] mb-3",
    emptyText: "text-[var(--dw-muted)] text-sm",
    card: "bg-[var(--dw-bg)] rounded-lg border border-[var(--dw-border)] hover:border-[var(--dw-accent)]/30 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--dw-surface)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--dw-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--dw-text)]",
    cardRemove: "text-xs text-[var(--dw-muted)] hover:text-[var(--dw-text)]"
  },

  shipping: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-[var(--dw-bg)] border border-[var(--dw-border)] rounded-xl",
    methodTitle: "text-sm font-medium text-[var(--dw-text)] mb-1",
    methodPrice: "text-xs text-[var(--dw-muted)]",
    methodEta: "text-xs text-[var(--dw-muted)] mt-1",
    footnoteWrap: "text-center text-sm text-[var(--dw-muted)]"
  },

  warranty: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    headerWrap: "mb-6",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-[var(--dw-bg)] rounded-xl p-5 border border-[var(--dw-border)]",
    cardTitle: "font-semibold text-[var(--dw-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--dw-surface)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--dw-accent)]",
    listText: "text-[var(--dw-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-[var(--dw-bg)] rounded-xl border border-[var(--dw-border)]",
    noteText: "text-sm text-[var(--dw-muted)] text-center",
    noteStrong: "font-medium text-[var(--dw-text)]"
  },

  sizeChart: {
    wrapper: "bg-[var(--dw-surface)] rounded-2xl p-8 border border-[var(--dw-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--dw-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--dw-bg)] flex items-center justify-center",
    titleIcon: "h-4 w-4 text-[var(--dw-accent)]",
    titleDivider: "w-12 h-px bg-[var(--dw-border)]",
    tableCard: "bg-[var(--dw-bg)] rounded-xl border border-[var(--dw-border)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--dw-bg)] border-b border-[var(--dw-border)]",
      headerCell: "px-5 py-3.5 text-left font-medium text-[var(--dw-muted)] uppercase tracking-wider",
      body: "divide-y divide-[var(--dw-border)]",
      row: "hover:bg-[var(--dw-surface)]/50 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-[var(--dw-muted)]",
      firstCell: "font-medium text-[var(--dw-text)]"
    },
    tips: {
      wrapper: "mt-6 bg-[var(--dw-bg)] rounded-xl p-6 border border-[var(--dw-border)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--dw-surface)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--dw-accent)]",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-[var(--dw-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--dw-surface)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--dw-accent)]",
      listText: "text-sm text-[var(--dw-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--dw-muted)] bg-[var(--dw-surface)] px-4 py-2 border border-[var(--dw-border)]",
    footerIcon: "w-4 h-4 text-[var(--dw-muted)]"
  }
};
