export function Logo() {
  return (
    <div class="flex items-center">
      <div class="w-3 h-8 bg-gradient-to-b from-white to-amber-400 rounded-xs"></div>
      <span class="text-xl ml-3 inline-flex font-code italic font-semibold tracking-[-0.04em] text-fg-primary transition hover:text-accent-strong">
        draft
      </span>
      <img
        src="/maskable-icon-512.png"
        width="24"
        height="24"
        class="relative -top-2 rounded-lg size-6 ml-1"
      />
    </div>
  );
}
