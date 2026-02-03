import { config } from '$lib/config/environment';

// Use environment-based configuration
export const CDS_BASE_URL = config.CDS_BASE_URL;

interface ContentItem {
	name: string;
	path: string;
	type: 'file' | 'directory';
	size: number;
	modified: string;
}

interface ContentResponse {
	success: boolean;
	content: ContentItem[];
	totalFiles: number;
}

interface ApiError {
	success: false;
	message: string;
	status: number;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const defaultOptions: RequestInit = {
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		};

		const requestOptions = { ...defaultOptions, ...options };

		try {
			const response = await fetch(url, requestOptions);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					message: 'An error occurred'
				}));

				throw {
					success: false,
					message: errorData.message || 'Request failed',
					status: response.status
				} as ApiError;
			}

			// Check if we're expecting a Blob (for file requests)
			const acceptHeader = (options.headers as Record<string, string>)?.Accept;
			if (acceptHeader === '*/*') {
				const blob = await response.blob();
				return blob as T;
			}

			// Otherwise parse as JSON
			const data = await response.json();
			return data;
		} catch (error) {
			if (error instanceof TypeError) {
				throw {
					success: false,
					message: 'Network error - unable to connect to server',
					status: 0
				} as ApiError;
			}
			throw error;
		}
	}

	async getContent(): Promise<ContentResponse> {
		return this.makeRequest<ContentResponse>('/content', {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getFile(path: string): Promise<Blob> {
		return this.makeRequest<Blob>(`/content/file/${encodeURIComponent(path)}`, {
			method: 'GET',
			headers: {
				Accept: '*/*'
			}
		});
	}
}

export const apiClient = new ApiClient(CDS_BASE_URL);

export const cdsApi = {
	getContent: () => apiClient.getContent(),
	getFile: (path: string) => apiClient.getFile(path)
};

export type { ContentItem, ContentResponse, ApiError };
