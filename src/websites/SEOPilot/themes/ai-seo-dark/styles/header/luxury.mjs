export const luxuryHeaderStyle = {
  wrapper: "bg-[var(--sbi-surface)]/95 backdrop-blur-md border-b border-[var(--sbi-glass-border)] sticky top-0 z-50 transition-colors duration-150",
  container: "max-w-7xl mx-auto px-4 relative",
  nav: {
    wrapper: "flex items-center justify-between h-16",
    brand: "font-display text-2xl font-light tracking-wide text-[var(--sbi-text)]",
    menu: {
      wrapper: "hidden md:flex space-x-8",
      item: "font-body text-sm font-light tracking-wide text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150"
    }
  },
  actions: {
    wrapper: "flex items-center space-x-4",
    currency: {
      button: "flex items-center space-x-2 text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150",
      text: "font-body text-sm font-light",
      dropdown: "absolute right-0 mt-2 py-2 w-48 bg-[var(--sbi-surface)] rounded-md shadow-xl border border-[var(--sbi-glass-border)] z-50",
      option: "block w-full text-left px-4 py-2 text-sm font-body font-light text-[var(--sbi-text)]"
    },
    language: {
      button: "flex items-center space-x-2 text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150",
      text: "font-body text-sm font-light",
      dropdown: "absolute right-0 mt-2 py-2 w-48 bg-[var(--sbi-surface)] rounded-md shadow-xl border border-[var(--sbi-glass-border)] z-50",
      option: "block w-full text-left px-4 py-2 text-sm font-body font-light text-[var(--sbi-text)]"
    },
    cart: {
      button: "text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] relative transition-colors duration-150",
      count: "absolute -top-2 -right-2 bg-[var(--sbi-accent)] text-[var(--sbi-text)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-body",
      drawer: "fixed inset-y-0 right-0 w-96 bg-[var(--sbi-surface)] shadow-xl border-l border-[var(--sbi-glass-border)] transform transition-transform duration-200 ease-in-out z-[200]",
      header: "p-4 border-b border-[var(--sbi-glass-border)]",
      title: "font-display text-xl font-light tracking-wide text-[var(--sbi-text)]",
      closeButton: "text-[var(--sbi-muted)] hover:text-[var(--sbi-text)] transition-colors duration-150"
    }
  },
  overlay: "fixed inset-0 bg-black/50 z-[150]"
};
