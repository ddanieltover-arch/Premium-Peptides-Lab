/** @type {import('next').NextConfig} */
const nextConfig = {
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
