export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-xl p-6",
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ds-text)] mb-4 uppercase",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    icon: "w-5 h-5 text-[var(--ds-accent)] flex-shrink-0",
    text: "font-body text-base text-[var(--ds-text)]"
  },
  faq: {
    wrapper: "bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-xl p-6",
    title: "font-display text-xl font-semibold tracking-wide text-[var(--ds-text)] mb-4 uppercase",
    list: "space-y-4",
    item: "border-b border-[var(--ds-border)] last:border-0 pb-4 last:pb-0",
    question: "font-display text-base font-semibold text-[var(--ds-text)] mb-2",
    answer: "font-body text-base text-[var(--ds-text)]"
  },
  loading: {
    wrapper: "fixed inset-0 bg-[var(--ds-bg)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--ds-border)] rounded-2xl"
  },
  specs: {
    wrapper: "bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-xl p-6",
    headerWrap: "mb-8",
    title: "font-display text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ds-text)] mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ds-border)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--ds-text)]",
    titleDivider: "w-12 h-px bg-[var(--ds-border)]",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "rounded-xl p-5 border border-[var(--ds-border)] bg-[var(--ds-bg)] hover:border-[var(--ds-accent)]/50 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-[var(--ds-border)] rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-[var(--ds-text)]",
    itemBody: "flex-1 min-w-0",
    label: "text-xs font-semibold text-[var(--ds-muted)] uppercase tracking-wider mb-1",
    value: "text-base font-medium text-[var(--ds-text)]",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-[var(--ds-text)] bg-[var(--ds-surface)] px-4 py-2 border border-[var(--ds-border)] rounded-lg",
    footerIcon: "w-4 h-4 text-[var(--ds-text)]"
  },
  reviews: {
    wrapper: "border-t border-[var(--ds-border)] pt-8",
    title: "font-display text-2xl font-semibold text-[var(--ds-text)] mb-6 uppercase"
  },
  recentlyViewed: {
    wrapper: "bg-[var(--ds-surface)] rounded-2xl p-8 border border-[var(--ds-border)]",
    header: "flex items-center justify-between mb-4",
    title: "font-display text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ds-text)] flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-[var(--ds-border)] flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-[var(--ds-text)]",
    clearButton: "text-sm text-[var(--ds-muted)] hover:text-[var(--ds-text)] underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-[var(--ds-muted)] mb-3",
    emptyText: "text-[var(--ds-muted)] text-sm",
    card: "bg-[var(--ds-bg)] rounded-lg border border-[var(--ds-border)] hover:border-[var(--ds-accent)]/50 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-[var(--ds-border)]",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-[var(--ds-text)] text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-[var(--ds-text)]",
    cardRemove: "text-xs text-[var(--ds-muted)] hover:text-[var(--ds-text)]"
  }
};
