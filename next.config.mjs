import path from 'path';
import {fileURLToPath} from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	serverRuntimeConfig: {
		PROJECT_ROOT: path.dirname(fileURLToPath(import.meta.url)),
	},
	webpack: config => {
		config.resolve.fallback = {...config.resolve.fallback, fs: false, path: false}
		return config
	},
};

export default nextConfig;
