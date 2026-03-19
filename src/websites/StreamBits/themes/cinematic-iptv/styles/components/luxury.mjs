export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)]",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] hover:border-[var(--sbi-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--sbi-accent)]",
    textWrap: "flex-1",
    text: "font-body text-[var(--sbi-text)] font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--sbi-muted)] bg-[var(--sbi-glass-bg)] px-4 py-2 border border-[var(--sbi-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--sbi-muted)]"
  },

  faq: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)]",
    list: "space-y-4",
    item: "group rounded-xl border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] hover:border-[var(--sbi-accent)]/30 transition-all duration-200 overflow-hidden",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center",
    questionIconText: "font-body text-[var(--sbi-muted)] font-semibold text-sm",
    question: "font-body text-base font-semibold text-[var(--sbi-text)] mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "font-body text-[var(--sbi-muted)] font-semibold text-xs",
    answer: "font-body text-[var(--sbi-muted)] text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--sbi-muted)] bg-[var(--sbi-glass-bg)] px-4 py-2 border border-[var(--sbi-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--sbi-muted)]"
  },

  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--sbi-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--sbi-glass-bg)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--sbi-glass-bg)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--sbi-glass-bg)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--sbi-glass-bg)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--sbi-glass-bg)] rounded"
    }
  },

  specs: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] hover:border-[var(--sbi-accent)]/30 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    itemBody: "flex-1 min-w-0",
    label: "font-body text-xs font-semibold text-[var(--sbi-muted)] uppercase tracking-wider mb-1",
    value: "font-body text-base font-medium text-[var(--sbi-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--sbi-muted)] bg-[var(--sbi-glass-bg)] px-4 py-2 border border-[var(--sbi-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--sbi-muted)]"
  },

  recentlyViewed: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    header: "flex items-center justify-between mb-4",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    clearButton: "font-body text-sm text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] underline transition-colors duration-150",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--sbi-muted)] mb-3",
    emptyText: "font-body text-[var(--sbi-muted)] text-sm",
    card: "rounded-lg border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] hover:border-[var(--sbi-accent)]/30 transition-colors duration-200",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--sbi-glass-bg)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-body font-medium text-[var(--sbi-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "font-body text-sm text-[var(--sbi-muted)]",
    cardRemove: "font-body text-xs text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150"
  },

  shipping: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)] mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 rounded-xl border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)]",
    methodTitle: "font-body text-sm font-medium text-[var(--sbi-text)] mb-1",
    methodPrice: "font-body text-xs text-[var(--sbi-muted)]",
    methodEta: "font-body text-xs text-[var(--sbi-muted)] mt-1",
    footnoteWrap: "text-center font-body text-sm text-[var(--sbi-muted)]"
  },

  warranty: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-6",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)] mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "rounded-xl p-5 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)]",
    cardTitle: "font-body font-semibold text-[var(--sbi-text)] text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-[var(--sbi-muted)]",
    listText: "font-body text-[var(--sbi-muted)] text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 rounded-xl border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)]",
    noteText: "font-body text-sm text-[var(--sbi-muted)] text-center",
    noteStrong: "font-body font-medium text-[var(--sbi-text)]"
  },

  reviews: {
    wrapper: "border-t border-[var(--sbi-glass-border)] pt-8",
    title: "font-display text-2xl font-light tracking-wide mb-6 flex items-center gap-2 text-[var(--sbi-text)]",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--sbi-glass-bg)] rounded-xl p-6 border border-[var(--sbi-glass-border)] hover:border-[var(--sbi-accent)]/30 transition-all duration-200 mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--sbi-accent)]/20 rounded-full flex items-center justify-center",
      avatarText: "font-body text-[var(--sbi-accent)] font-semibold",
      authorInfo: {
        name: "font-body font-medium text-[var(--sbi-text)]",
        meta: "font-body text-sm text-[var(--sbi-muted)] flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--sbi-accent)]/20 text-[var(--sbi-accent)]"
      },
      rating: "flex text-amber-400",
      content: "font-body text-base font-light text-[var(--sbi-muted)]"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-body inline-flex items-center px-4 py-2 border border-[var(--sbi-glass-border)] rounded-md text-sm font-medium text-[var(--sbi-text)] bg-[var(--sbi-glass-bg)] hover:bg-[var(--sbi-surface)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--sbi-accent)]"
    }
  },

  sizeChart: {
    wrapper: "rounded-2xl p-8 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "font-body text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sbi-muted)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--sbi-glass-bg)] flex items-center justify-center rounded-lg",
    titleIcon: "h-4 w-4 text-[var(--sbi-muted)]",
    titleDivider: "w-12 h-px bg-[var(--sbi-glass-border)]",
    tableCard: "rounded-xl border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)] overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-[var(--sbi-glass-bg)] border-b border-[var(--sbi-glass-border)]",
      headerCell: "px-5 py-3.5 text-left font-medium font-body text-[var(--sbi-muted)] uppercase tracking-wider",
      body: "divide-y divide-[var(--sbi-glass-border)]",
      row: "hover:bg-[var(--sbi-glass-bg)] transition-colors duration-150",
      cell: "px-5 py-4 whitespace-nowrap font-body text-[var(--sbi-muted)]",
      firstCell: "font-body font-medium text-[var(--sbi-text)]"
    },
    tips: {
      wrapper: "mt-6 rounded-xl p-6 border border-[var(--sbi-glass-border)] bg-[var(--sbi-glass-bg)]",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-[var(--sbi-muted)]",
      contentWrap: "flex-1",
      title: "font-body text-sm font-medium text-[var(--sbi-text)] mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-[var(--sbi-glass-bg)] rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-[var(--sbi-muted)]",
      listText: "font-body text-sm text-[var(--sbi-muted)] leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 font-body text-sm text-[var(--sbi-muted)] bg-[var(--sbi-glass-bg)] px-4 py-2 border border-[var(--sbi-glass-border)] rounded-lg transition-colors duration-150",
    footerIcon: "w-4 h-4 text-[var(--sbi-muted)]"
  }
};
