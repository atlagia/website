export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    icon: "w-5 h-5 text-green-600 flex-shrink-0",
    text: "font-body text-base font-light text-neutral-700"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-white border border-neutral-200 rounded-xl p-6 shadow-sm",
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    list: "space-y-4",
    item: "border-b border-neutral-200 last:border-0 pb-4 last:pb-0",
    question: "font-display text-base font-semibold text-neutral-900 mb-2",
    answer: "font-body text-base font-light text-neutral-600"
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
    title: "font-display text-xl font-semibold tracking-wide text-neutral-900 mb-4 uppercase",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    label: "font-body text-sm font-medium text-neutral-600",
    value: "font-body text-sm font-light text-neutral-900"
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
    wrapper: "border-t border-neutral-200 pt-8",
    title: "font-display text-2xl font-semibold tracking-wide mb-6 flex items-center gap-2 text-neutral-900 uppercase",
    table: {
      wrapper: "overflow-x-auto bg-white rounded-xl shadow-sm border border-neutral-200",
      table: "min-w-full divide-y divide-neutral-200",
      header: "bg-neutral-50",
      headerCell: "font-body px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider",
      row: "hover:bg-neutral-50 transition-colors",
      cell: "font-body px-6 py-4 whitespace-nowrap text-sm text-neutral-600"
    },
    tips: {
      wrapper: "mt-4 bg-neutral-100 rounded-xl p-4 border border-neutral-200",
      title: "font-display font-semibold mb-2 text-sm text-neutral-900",
      list: "list-disc list-inside space-y-1 font-body text-sm text-neutral-600"
    }
  }
};
