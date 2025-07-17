/** @type {import('next').NextConfig} */
import WithPWA from 'next-pwa';

const withPWA = WithPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default withPWA({
  devIndicators: false,
});
