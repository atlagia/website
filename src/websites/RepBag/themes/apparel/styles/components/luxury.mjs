export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "bg-[var(--luxury-ivory)] border border-[var(--luxury-beige)] rounded-xl p-6 shadow-sm",
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    icon: "w-5 h-5 text-[var(--luxury-gold)] flex-shrink-0",
    text: "font-body text-base text-[var(--luxury-text)]"
  },

  faq: {
    wrapper: "bg-[var(--luxury-ivory)] border border-[var(--luxury-beige)] rounded-xl p-6 shadow-sm",
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    list: "space-y-4",
    item: "border-b border-[var(--luxury-beige)] last:border-0 pb-4 last:pb-0",
    question: "font-display text-base font-medium text-[var(--luxury-black)] mb-2",
    answer: "font-body text-base text-[var(--luxury-text)]"
  },

  loading: {
    wrapper: "product-loading fixed inset-0 bg-[var(--luxury-ivory)] z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-[var(--luxury-beige)] rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-[var(--luxury-beige)] rounded w-3/4",
      subtitleLine: "h-4 bg-[var(--luxury-beige)] rounded w-1/4",
      priceLine: "h-12 bg-[var(--luxury-beige)] rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-[var(--luxury-beige)] rounded"
    }
  },

  specs: {
    wrapper: "bg-[var(--luxury-ivory)] border border-[var(--luxury-beige)] rounded-xl p-6 shadow-sm",
    title: "font-display text-xl font-medium text-[var(--luxury-black)] mb-4",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    label: "font-body text-sm font-medium text-[var(--luxury-text)]/70",
    value: "font-body text-sm text-[var(--luxury-black)]"
  },

  reviews: {
    wrapper: "border-t border-[var(--luxury-beige)] pt-8",
    title: "font-display text-2xl font-medium text-[var(--luxury-black)] mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-[var(--luxury-beige)]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-[var(--luxury-gold)]/20 rounded-full flex items-center justify-center",
      avatarText: "text-[var(--luxury-gold)] font-semibold",
      authorInfo: {
        name: "font-display font-medium text-[var(--luxury-black)]",
        meta: "text-sm text-[var(--luxury-text)]/60 flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--luxury-gold)]/20 text-[var(--luxury-gold)]"
      },
      rating: "flex text-[var(--luxury-gold)]",
      content: "font-body text-base text-[var(--luxury-text)]"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-body inline-flex items-center px-4 py-2 border border-[var(--luxury-beige)] rounded-md text-sm text-[var(--luxury-text)] bg-[var(--luxury-ivory)] hover:bg-[var(--luxury-beige)]/30 transition-colors duration-200"
    }
  },

  sizeChart: {
    wrapper: "border-t border-[var(--luxury-beige)] pt-8",
    title: "font-display text-2xl font-medium text-[var(--luxury-black)] mb-6 flex items-center gap-2",
    table: {
      wrapper: "overflow-x-auto bg-[var(--luxury-ivory)] rounded-xl shadow-sm border border-[var(--luxury-beige)]",
      table: "min-w-full divide-y divide-[var(--luxury-beige)]",
      header: "bg-[var(--luxury-beige)]/20",
      headerCell: "font-body px-6 py-3 text-left text-xs font-medium text-[var(--luxury-text)] uppercase tracking-wider",
      row: "hover:bg-[var(--luxury-beige)]/10 transition-colors",
      cell: "font-body px-6 py-4 whitespace-nowrap text-sm text-[var(--luxury-text)]"
    },
    tips: {
      wrapper: "mt-4 bg-[var(--luxury-gold)]/10 rounded-xl p-4 border border-[var(--luxury-gold)]/20",
      title: "font-display font-semibold mb-2 text-sm text-[var(--luxury-gold)]",
      list: "list-disc list-inside space-y-1 font-body text-sm text-[var(--luxury-text)]"
    }
  }
}; 