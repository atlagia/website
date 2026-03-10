export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-2 uppercase flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative bg-white rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center",
    itemIcon: "w-5 h-5 text-green-600 flex-shrink-0",
    textWrap: "flex-1",
    text: "font-body text-base font-light text-neutral-700",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200 rounded-lg",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-2 uppercase flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200",
    list: "space-y-4",
    item: "group border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 overflow-hidden bg-neutral-50/50",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center",
    questionIconText: "text-neutral-600 font-semibold text-sm",
    question: "font-display text-base font-semibold text-neutral-900 mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "text-neutral-600 font-semibold text-xs",
    answer: "font-body text-base font-light text-neutral-600",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200 rounded-lg",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-neutral-50 z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-neutral-200 rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-neutral-200 rounded w-3/4",
      subtitleLine: "h-4 bg-neutral-200 rounded w-1/4",
      priceLine: "h-12 bg-neutral-200 rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-neutral-200 rounded"
    }
  },

  // Product Specs styles
  specs: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-2 uppercase flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "group relative rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-neutral-600",
    itemBody: "flex-1 min-w-0",
    label: "font-body text-sm font-medium text-neutral-600",
    value: "font-body text-sm font-light text-neutral-900",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200 rounded-lg",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  // Recently Viewed
  recentlyViewed: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    header: "flex items-center justify-between mb-4",
    title: "font-display text-sm font-semibold uppercase tracking-wide text-neutral-700 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    clearButton: "text-sm text-neutral-500 hover:text-neutral-900 underline transition-colors font-body",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-neutral-400 mb-3",
    emptyText: "text-neutral-500 text-sm font-body",
    card: "bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-neutral-50",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-neutral-900 text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-neutral-900 font-body",
    cardRemove: "text-xs text-neutral-400 hover:text-neutral-600 font-body"
  },

  shipping: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    title: "font-display text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200 mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-white border border-neutral-200 rounded-xl",
    methodTitle: "text-sm font-medium text-neutral-900 mb-1",
    methodPrice: "text-xs text-neutral-600",
    methodEta: "text-xs text-neutral-500 mt-1",
    footnoteWrap: "text-center text-sm text-neutral-500"
  },

  warranty: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-sm font-semibold uppercase tracking-wide text-neutral-700 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200 mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-white rounded-xl p-5 border border-neutral-200",
    cardTitle: "font-semibold text-neutral-900 text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-neutral-600",
    listText: "text-neutral-600 text-sm leading-relaxed font-body",
    noteWrap: "mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200",
    noteText: "text-sm text-neutral-600 text-center font-body",
    noteStrong: "font-medium text-neutral-900"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t border-neutral-200 pt-8",
    title: "font-display text-2xl font-semibold tracking-wide mb-6 flex items-center gap-2 text-neutral-900 uppercase",
    list: "space-y-6",
    review: {
      wrapper: "bg-neutral-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-4 border border-neutral-200",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center",
      avatarText: "text-neutral-700 font-semibold",
      authorInfo: {
        name: "font-display font-semibold text-neutral-900",
        meta: "text-sm text-neutral-500 flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200"
      },
      rating: "flex text-amber-500",
      content: "font-body text-base font-light text-neutral-700"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-body inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors duration-200"
    }
  },

  // Size Chart styles
  sizeChart: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-100 flex items-center justify-center rounded-lg",
    titleIcon: "h-4 w-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-200",
    tableCard: "bg-white rounded-xl border border-neutral-200 overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-neutral-50 border-b border-neutral-200",
      headerCell: "px-5 py-3.5 text-left font-medium text-neutral-600 uppercase tracking-wider font-body",
      body: "divide-y divide-neutral-200",
      row: "hover:bg-neutral-50/50 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-neutral-600 font-body",
      firstCell: "font-medium text-neutral-900"
    },
    tips: {
      wrapper: "mt-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-neutral-600",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-neutral-900 mb-3 font-display",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-neutral-600",
      listText: "text-sm text-neutral-600 leading-relaxed font-body"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200 rounded-lg",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  careInstructions: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    headerWrap: "mb-6",
    title: "font-display text-sm font-semibold uppercase tracking-wide text-neutral-700 flex items-center gap-2",
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
