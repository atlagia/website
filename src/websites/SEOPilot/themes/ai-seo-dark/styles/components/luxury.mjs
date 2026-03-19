export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] hover:border-[var(--seo-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--seo-accent)]",
    textWrap: "flex-1",
    text: "font-body text-[var(--seo-text)] font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--seo-muted)] bg-[var(--seo-glass-bg)] px-4 py-2 border border-[var(--seo-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--seo-muted)]"
  },

  faq: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)]",
    list: "space-y-4",
    item: "group rounded-xl border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] hover:border-[var(--seo-accent)]/30 transition-all duration-200 overflow-hidden",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center",
    questionIconText: "font-body text-[var(--seo-muted)] font-semibold text-sm",
    question: "font-body text-base font-semibold text-[var(--seo-text)] mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "font-body text-[var(--seo-muted)] font-semibold text-xs",
    answer: "font-body text-[var(--seo-muted)] text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--seo-muted)] bg-[var(--seo-glass-bg)] px-4 py-2 border border-[var(--seo-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--seo-muted)]"
  },

  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--seo-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--seo-glass-bg)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--seo-glass-bg)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--seo-glass-bg)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--seo-glass-bg)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--seo-glass-bg)] rounded"
    }
  },

  specs: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] hover:border-[var(--seo-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--seo-muted)]",
    itemBody: "flex-1 min-w-0",
    label: "font-body text-xs font-semibold text-[var(--seo-muted)] uppercase tracking-wider mb-1",
    value: "font-body text-base font-medium text-[var(--seo-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--seo-muted)] bg-[var(--seo-glass-bg)] px-4 py-2 border border-[var(--seo-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--seo-muted)]"
  },

  recentlyViewed: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    header: "flex items-center justify-between mb-4",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    clearButton: "font-body text-sm text-[var(--seo-muted)] hover:text-[var(--seo-text)] underline transition-colors duration-150",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--seo-muted)] mb-3",
    emptyText: "font-body text-[var(--seo-muted)] text-sm",
    card: "rounded-lg border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] hover:border-[var(--seo-accent)]/30 transition-colors duration-200",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--seo-glass-bg)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-body font-medium text-[var(--seo-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "font-body text-sm text-[var(--seo-muted)]",
    cardRemove: "font-body text-xs text-[var(--seo-muted)] hover:text-[var(--seo-text)] transition-colors duration-150"
  },

  shipping: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 rounded-xl border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)]",
    methodTitle: "font-body text-sm font-medium text-[var(--seo-text)] mb-1",
    methodPrice: "font-body text-xs text-[var(--seo-muted)]",
    methodEta: "font-body text-xs text-[var(--seo-muted)] mt-1",
    footnoteWrap: "text-center font-body text-sm text-[var(--seo-muted)]"
  },

  warranty: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-6",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "rounded-xl p-5 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)]",
    cardTitle: "font-body font-semibold text-[var(--seo-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--seo-muted)]",
    listText: "font-body text-[var(--seo-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 rounded-xl border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)]",
    noteText: "font-body text-sm text-[var(--seo-muted)] text-center",
    noteStrong: "font-body font-medium text-[var(--seo-text)]"
  },

  reviews: {
    wrapper: "border-t border-[var(--seo-glass-border)] pt-8",
    title: "font-display text-2xl font-light tracking-wide mb-6 flex items-center gap-2 text-[var(--seo-text)]",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--seo-glass-bg)] rounded-xl p-6 border border-[var(--seo-glass-border)] hover:border-[var(--seo-accent)]/30 transition-all duration-200 mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--seo-accent)]/20 rounded-full flex items-center justify-center",
      avatarText: "font-body text-[var(--seo-accent)] font-semibold",
      authorInfo: {
        name: "font-body font-medium text-[var(--seo-text)]",
        meta: "font-body text-sm text-[var(--seo-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--seo-accent)]/20 text-[var(--seo-accent)]"
      },
      rating: "flex text-amber-400",
      content: "font-body text-base font-light text-[var(--seo-muted)]"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-body inline-flex items-center px-4 py-2 border border-[var(--seo-glass-border)] rounded-md text-sm font-medium text-[var(--seo-text)] bg-[var(--seo-glass-bg)] hover:bg-[var(--seo-surface)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--seo-accent)]"
    }
  },

  sizeChart: {
    wrapper: "rounded-2xl p-8 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seo-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--seo-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "h-4 w-4 text-[var(--seo-muted)]",
    titleDivider: "w-12 h-px bg-[var(--seo-glass-border)]",
    tableCard: "rounded-xl border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--seo-glass-bg)] border-b border-[var(--seo-glass-border)]",
      headerCell: "px-5 py-3.5 text-left font-medium font-body text-[var(--seo-muted)] uppercase tracking-wider",
      body: "divide-y divide-[var(--seo-glass-border)]",
      row: "hover:bg-[var(--seo-glass-bg)] transition-colors duration-150",
      cell: "px-5 py-4 whitespace-nowrap font-body text-[var(--seo-muted)]",
      firstCell: "font-body font-medium text-[var(--seo-text)]"
    },
    tips: {
      wrapper: "mt-6 rounded-xl p-6 border border-[var(--seo-glass-border)] bg-[var(--seo-glass-bg)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--seo-muted)]",
      contentWrap: "flex-1",
      title: "font-body text-sm font-medium text-[var(--seo-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--seo-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--seo-muted)]",
      listText: "font-body text-sm text-[var(--seo-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--seo-muted)] bg-[var(--seo-glass-bg)] px-4 py-2 border border-[var(--seo-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--seo-muted)]"
  }
};
