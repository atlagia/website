/**
 * Shared component styles (ProductSpecs, RecentlyViewed, KeyFeatures, ProductFAQ, Reviews,
 * ProductLoading, ShippingInfo, ProductWarranty, SizeChart). Core merges these over defaults.
 * GlobalGiftCards: --ggc-* (light theme).
 */
export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-[var(--ggc-bg)] rounded-xl p-5 border border-[var(--ggc-border)] hover:border-[var(--ggc-accent)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--ggc-border)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    textWrap: "flex-1",
    text: "text-[var(--ggc-text)] font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--ggc-muted)] bg-[var(--ggc-bg)] px-4 py-2 border border-[var(--ggc-border)]",
    footerIcon: "w-4 h-4 text-[var(--ggc-muted)]"
  },

  faq: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)]",
    list: "space-y-4",
    item: "group bg-[var(--ggc-bg)] rounded-xl border border-[var(--ggc-border)] hover:border-[var(--ggc-accent)] transition-all duration-200 overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--ggc-border)] rounded-full flex items-center justify-center",
    questionIconText: "text-[var(--ggc-muted)] font-semibold text-sm",
    question: "text-base font-semibold text-[var(--ggc-text)] mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-[var(--ggc-border)] rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "text-[var(--ggc-muted)] font-semibold text-xs",
    answer: "text-[var(--ggc-muted)] text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--ggc-muted)] bg-[var(--ggc-bg)] px-4 py-2 border border-[var(--ggc-border)]",
    footerIcon: "w-4 h-4 text-[var(--ggc-muted)]"
  },

  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--ggc-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--ggc-surface)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--ggc-surface)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--ggc-surface)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--ggc-surface)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--ggc-surface)] rounded"
    }
  },

  specs: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-[var(--ggc-bg)] rounded-xl p-5 border border-[var(--ggc-border)] hover:border-[var(--ggc-accent)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ggc-accent)] focus-visible:ring-offset-2",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--ggc-border)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    itemBody: "flex-1 min-w-0",
    label: "text-xs font-semibold text-[var(--ggc-muted)] uppercase tracking-wider mb-1",
    value: "text-base font-medium text-[var(--ggc-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--ggc-muted)] bg-[var(--ggc-bg)] px-4 py-2 border border-[var(--ggc-border)]",
    footerIcon: "w-4 h-4 text-[var(--ggc-muted)]"
  },

  reviews: {
    wrapper: "border-t border-[var(--ggc-border)] pt-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--ggc-surface)] rounded-xl p-5 border border-[var(--ggc-border)] hover:border-[var(--ggc-accent)] transition-colors duration-150 mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--ggc-border)] rounded-full flex items-center justify-center",
      avatarText: "text-[var(--ggc-text)] font-semibold text-sm",
      authorInfo: {
        name: "font-medium text-[var(--ggc-text)]",
        meta: "text-sm text-[var(--ggc-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--ggc-surface)] text-[var(--ggc-text)] border border-[var(--ggc-border)]"
      },
      rating: "flex text-[var(--ggc-muted)] text-sm",
      content: "text-[var(--ggc-muted)] text-sm leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-[var(--ggc-border)] rounded text-sm font-medium text-[var(--ggc-text)] bg-[var(--ggc-bg)] hover:bg-[var(--ggc-surface)] hover:border-[var(--ggc-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ggc-accent)] focus:ring-offset-2 transition-colors duration-150"
    }
  },

  recentlyViewed: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    header: "flex items-center justify-between mb-4",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    clearButton: "text-sm text-[var(--ggc-muted)] hover:text-[var(--ggc-accent)] underline transition-colors duration-150",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--ggc-muted)] mb-3",
    emptyText: "text-[var(--ggc-muted)] text-sm",
    card: "bg-[var(--ggc-bg)] rounded-lg border border-[var(--ggc-border)] hover:border-[var(--ggc-accent)] transition-colors duration-200",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--ggc-surface)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--ggc-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--ggc-text)]",
    cardRemove: "text-xs text-[var(--ggc-muted)] hover:text-[var(--ggc-accent)]"
  },

  shipping: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-[var(--ggc-bg)] border border-[var(--ggc-border)] rounded-xl",
    methodTitle: "text-sm font-medium text-[var(--ggc-text)] mb-1",
    methodPrice: "text-xs text-[var(--ggc-muted)]",
    methodEta: "text-xs text-[var(--ggc-muted)] mt-1",
    footnoteWrap: "text-center text-sm text-[var(--ggc-muted)]"
  },

  warranty: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    headerWrap: "mb-6",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "w-4 h-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-[var(--ggc-bg)] rounded-xl p-5 border border-[var(--ggc-border)]",
    cardTitle: "font-semibold text-[var(--ggc-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--ggc-border)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--ggc-muted)]",
    listText: "text-[var(--ggc-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-[var(--ggc-surface)] rounded-xl border border-[var(--ggc-border)]",
    noteText: "text-sm text-[var(--ggc-muted)] text-center",
    noteStrong: "font-medium text-[var(--ggc-text)]"
  },

  sizeChart: {
    wrapper: "bg-[var(--ggc-surface)] rounded-2xl p-8 border border-[var(--ggc-border)]",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-[var(--ggc-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ggc-border)] flex items-center justify-center",
    titleIcon: "h-4 w-4 text-[var(--ggc-muted)]",
    titleDivider: "w-12 h-px bg-[var(--ggc-border)]",
    tableCard: "bg-[var(--ggc-bg)] rounded-xl border border-[var(--ggc-border)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--ggc-surface)] border-b border-[var(--ggc-border)]",
      headerCell: "px-5 py-3.5 text-left font-medium text-[var(--ggc-muted)] uppercase tracking-wider",
      body: "divide-y divide-[var(--ggc-border)]",
      row: "hover:bg-[var(--ggc-surface)]/50 transition-colors duration-150",
      cell: "px-5 py-4 whitespace-nowrap text-[var(--ggc-muted)]",
      firstCell: "font-medium text-[var(--ggc-text)]"
    },
    tips: {
      wrapper: "mt-6 bg-[var(--ggc-surface)] rounded-xl p-6 border border-[var(--ggc-border)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--ggc-border)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--ggc-muted)]",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-[var(--ggc-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--ggc-border)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--ggc-muted)]",
      listText: "text-sm text-[var(--ggc-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--ggc-muted)] bg-[var(--ggc-bg)] px-4 py-2 border border-[var(--ggc-border)]",
    footerIcon: "w-4 h-4 text-[var(--ggc-muted)]"
  }
};
