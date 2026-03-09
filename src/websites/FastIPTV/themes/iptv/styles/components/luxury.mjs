export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-emerald-400",
    textWrap: "flex-1",
    text: "text-gray-200 font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-gray-300 bg-white/10 px-4 py-2 border border-white/20 rounded-lg",
    footerIcon: "w-4 h-4 text-gray-400"
  },

  // Product FAQ styles (dark theme)
  faq: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20",
    list: "space-y-4",
    item: "group rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-200 overflow-hidden",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center",
    questionIconText: "text-gray-300 font-semibold text-sm",
    question: "text-base font-semibold text-gray-100 mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "text-gray-400 font-semibold text-xs",
    answer: "text-gray-300 text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-gray-300 bg-white/10 px-4 py-2 border border-white/20 rounded-lg",
    footerIcon: "w-4 h-4 text-gray-400"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-white z-50",
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

  // Product Specs styles (dark theme)
  specs: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative rounded-xl p-5 border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-gray-300",
    itemBody: "flex-1 min-w-0",
    label: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1",
    value: "text-base font-medium text-gray-100",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-gray-300 bg-white/10 px-4 py-2 border border-white/20 rounded-lg",
    footerIcon: "w-4 h-4 text-gray-400"
  },

  // Recently Viewed (dark theme)
  recentlyViewed: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    header: "flex items-center justify-between mb-4",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    clearButton: "text-sm text-gray-400 hover:text-white underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-gray-500 mb-3",
    emptyText: "text-gray-400 text-sm",
    card: "rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-white/5",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-gray-200 text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-gray-300",
    cardRemove: "text-xs text-gray-400 hover:text-gray-200"
  },

  shipping: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20 mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 rounded-xl border border-white/10 bg-white/5",
    methodTitle: "text-sm font-medium text-gray-100 mb-1",
    methodPrice: "text-xs text-gray-400",
    methodEta: "text-xs text-gray-500 mt-1",
    footnoteWrap: "text-center text-sm text-gray-400"
  },

  warranty: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    headerWrap: "mb-6",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20 mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "rounded-xl p-5 border border-white/10 bg-white/5",
    cardTitle: "font-semibold text-gray-100 text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-gray-400",
    listText: "text-gray-300 text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 rounded-xl border border-white/10 bg-white/5",
    noteText: "text-sm text-gray-400 text-center",
    noteStrong: "font-medium text-gray-100"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t pt-8",
    title: "font-['Inter'] text-2xl font-light tracking-wide mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center",
      avatarText: "text-blue-600 font-semibold",
      authorInfo: {
        name: "font-['Inter'] font-medium text-gray-900",
        meta: "text-sm text-gray-500 flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
      },
      rating: "flex text-yellow-400",
      content: "font-['Inter'] text-base font-light text-gray-700"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-['Inter'] inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-light text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    }
  },

  // Size Chart styles (full structure, dark theme)
  sizeChart: {
    wrapper: "rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl",
    headerWrap: "mb-8",
    title: "text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg",
    titleIcon: "h-4 w-4 text-gray-300",
    titleDivider: "w-12 h-px bg-white/20",
    tableCard: "rounded-xl border border-white/10 bg-white/5 overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-white/10 border-b border-white/10",
      headerCell: "px-5 py-3.5 text-left font-medium text-gray-400 uppercase tracking-wider",
      body: "divide-y divide-white/10",
      row: "hover:bg-white/5 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-gray-300",
      firstCell: "font-medium text-gray-100"
    },
    tips: {
      wrapper: "mt-6 rounded-xl p-6 border border-white/10 bg-white/5",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-gray-400",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-gray-100 mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-gray-400",
      listText: "text-sm text-gray-300 leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-gray-400 bg-white/10 px-4 py-2 border border-white/20 rounded-lg",
    footerIcon: "w-4 h-4 text-gray-400"
  }
}; 