/**
 * Shared component styles (ProductSpecs, RecentlyViewed, KeyFeatures, ProductFAQ, Reviews,
 * ProductLoading, ShippingInfo, ProductWarranty, SizeChart). Core merges these over defaults.
 * Include all params so new stores can override any key.
 */
export const luxuryComponentStyle = {
  keyFeatures: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300",
    list: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-white rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-neutral-600",
    textWrap: "flex-1",
    text: "text-neutral-700 font-medium leading-relaxed text-sm",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  faq: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300",
    list: "space-y-4",
    item: "group bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all duration-200 overflow-hidden",
    questionIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center",
    questionIconText: "text-neutral-600 font-semibold text-sm",
    question: "text-base font-semibold text-neutral-900 mb-2",
    answerIconWrap: "flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center mt-0.5",
    answerIconText: "text-neutral-600 font-semibold text-xs",
    answer: "text-neutral-600 text-sm leading-relaxed",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

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

  specs: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5",
    item: "group relative bg-white rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all duration-200",
    itemContent: "flex items-start gap-4",
    itemIconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center",
    itemIcon: "w-4 h-4 text-neutral-600",
    itemBody: "flex-1 min-w-0",
    label: "text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1",
    value: "text-base font-medium text-neutral-900",
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200",
    footerIcon: "w-4 h-4 text-neutral-400"
  },

  reviews: {
    wrapper: "border-t border-neutral-200 pt-8",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-neutral-50 rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-colors mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center",
      avatarText: "text-neutral-700 font-semibold text-sm",
      authorInfo: {
        name: "font-medium text-neutral-900",
        meta: "text-sm text-neutral-500 flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 text-neutral-700 border border-neutral-300"
      },
      rating: "flex text-neutral-400 text-sm",
      content: "text-neutral-600 text-sm leading-relaxed"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "inline-flex items-center px-4 py-2 border border-neutral-200 rounded text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-colors"
    }
  },

  recentlyViewed: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    header: "flex items-center justify-between mb-4",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    clearButton: "text-sm text-neutral-500 hover:text-neutral-900 underline transition-colors",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    emptyWrap: "text-center py-8",
    emptyIcon: "text-neutral-400 mb-3",
    emptyText: "text-neutral-500 text-sm",
    card: "bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors",
    cardLink: "block",
    cardImageWrap: "aspect-square overflow-hidden bg-gray-50",
    cardImage: "w-full h-full object-cover",
    cardBody: "p-3",
    cardTitle: "font-medium text-gray-900 text-sm line-clamp-2 mb-1",
    cardBottom: "flex items-center justify-between",
    cardPrice: "text-sm text-gray-900",
    cardRemove: "text-xs text-gray-400 hover:text-gray-600"
  },

  shipping: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300 mb-6",
    methodsGrid: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    methodCard: "text-center p-4 bg-white border border-neutral-200 rounded-xl",
    methodTitle: "text-sm font-medium text-neutral-900 mb-1",
    methodPrice: "text-xs text-neutral-600",
    methodEta: "text-xs text-neutral-500 mt-1",
    footnoteWrap: "text-center text-sm text-neutral-500"
  },

  warranty: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    headerWrap: "mb-6",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "w-4 h-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300 mt-2",
    columns: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    card: "bg-white rounded-xl p-5 border border-neutral-200",
    cardTitle: "font-semibold text-neutral-900 text-base mb-3",
    list: "space-y-2",
    listItem: "flex items-start gap-3",
    listIconWrap: "flex-shrink-0 w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center mt-0.5",
    listIcon: "w-3 h-3 text-neutral-600",
    listText: "text-neutral-600 text-sm leading-relaxed",
    noteWrap: "mt-6 p-4 bg-neutral-100 rounded-xl border border-neutral-200",
    noteText: "text-sm text-neutral-600 text-center",
    noteStrong: "font-medium text-neutral-900"
  },

  sizeChart: {
    wrapper: "bg-neutral-50 rounded-2xl p-8 border border-neutral-200",
    headerWrap: "mb-8",
    title: "text-sm font-medium uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2",
    titleIconWrap: "w-8 h-8 bg-neutral-200 flex items-center justify-center",
    titleIcon: "h-4 w-4 text-neutral-600",
    titleDivider: "w-12 h-px bg-neutral-300",
    tableCard: "bg-white rounded-xl border border-neutral-200 overflow-hidden",
    tableScroll: "overflow-x-auto",
    table: {
      table: "min-w-full text-sm",
      header: "bg-neutral-100 border-b border-neutral-200",
      headerCell: "px-5 py-3.5 text-left font-medium text-neutral-600 uppercase tracking-wider",
      body: "divide-y divide-neutral-200",
      row: "hover:bg-neutral-50/50 transition-colors",
      cell: "px-5 py-4 whitespace-nowrap text-neutral-600",
      firstCell: "font-medium text-neutral-900"
    },
    tips: {
      wrapper: "mt-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200",
      inner: "flex items-start gap-4",
      iconWrap: "flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center",
      icon: "w-4 h-4 text-neutral-600",
      contentWrap: "flex-1",
      title: "text-sm font-medium text-neutral-900 mb-3",
      listWrap: "space-y-2",
      listRow: "flex items-start gap-3",
      listIconWrap: "flex-shrink-0 w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center mt-0.5",
      listIcon: "w-3 h-3 text-neutral-600",
      listText: "text-sm text-neutral-600 leading-relaxed"
    },
    footerWrap: "mt-6 text-center",
    footerInner: "inline-flex items-center gap-2 text-sm text-neutral-500 bg-white px-4 py-2 border border-neutral-200",
    footerIcon: "w-4 h-4 text-neutral-400"
  }
};
