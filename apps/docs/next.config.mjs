import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// 關於如何部屬到 github pages, 請參考 https://zephinax.com/blog/deploy-nextjs-fumadocs-github-pages

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'brigid';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `https://brigid-dicom.github.io/${repoName}/` : '',
};

export default withMDX(config);
