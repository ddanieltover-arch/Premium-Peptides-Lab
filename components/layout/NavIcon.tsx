type NavIconName = 'home' | 'shop' | 'search' | 'cart' | 'account';

const paths: Record<NavIconName, JSX.Element> = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 10.5 12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
    />
  ),
  shop: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2M9 20a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"
    />
  ),
  search: (
    <path strokeLinecap="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
  ),
  cart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"
    />
  ),
  account: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 18v-1a4 4 0 00-8 0v1M12 12a4 4 0 100-8 4 4 0 000 8z"
    />
  ),
};

export function NavIcon({ name, className = 'h-5 w-5' }: { name: NavIconName; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      {paths[name]}
    </svg>
  );
}
