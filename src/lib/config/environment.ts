// Environment configurations
const environments = {
	local: {
		API_BASE_URL: 'http://localhost:3000/api',
		CDS_BASE_URL: 'http://localhost:3003/api',
		environment: 'local'
	},
	production: {
		API_BASE_URL: 'https://api.example.com/api',
		CDS_BASE_URL: 'https://cds.example.com/api',
		environment: 'production'
	}
};

// Declare global window interface
import { env as publicEnv } from '$env/dynamic/public';
declare global {
	interface Window {
		__ENV__?: {
			ENVIRONMENT?: string;
		};
	}
}

// Get environment from runtime or build-time
function getEnvironment(): string {
	// Runtime environment (from window.__ENV__) - PRIORITY
	if (typeof window !== 'undefined' && window.__ENV__?.ENVIRONMENT) {
		return window.__ENV__.ENVIRONMENT;
	}

	// Check for environment in URL parameters (for testing)
	if (typeof window !== 'undefined') {
		const urlParams = new URLSearchParams(window.location.search);
		const envFromUrl = urlParams.get('env');
		if (envFromUrl) {
			return envFromUrl;
		}
	}

	// Build-time/public env via SvelteKit dynamic env (works in SSR)
	const buildTimeEnv = publicEnv.PUBLIC_ENVIRONMENT;
	if (buildTimeEnv) {
		return buildTimeEnv;
	}

	// Default to 'local' for development
	return 'local';
}

// Get current configuration
export const config = (() => {
	const env = getEnvironment();
	return environments[env as keyof typeof environments] || environments.local;
})();
