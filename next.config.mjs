/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/peptides', destination: '/categories/peptides', permanent: true },
      { source: '/sarms', destination: '/categories/sarms', permanent: true },
      { source: '/hgh', destination: '/categories/hgh', permanent: true },
      { source: '/injectables', destination: '/categories/injectables', permanent: true },
      { source: '/orals', destination: '/categories/oral-tablets', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'tbgmkqklkshkjfhcqtzz.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'fwzantgfbvtfpzujgmjr.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'peptidepeak.online', pathname: '/**' },
    ],
  },
};

export default nextConfig;
