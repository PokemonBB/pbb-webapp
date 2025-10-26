import { writable } from 'svelte/store';
import { cdsApi, type ContentItem, type ContentResponse } from '$lib/utils/cds';
import { cacheStore } from './cacheStore';

interface ContentCache {
	[path: string]: Blob;
}

interface ContentLoadingState {
	isLoading: boolean;
	progress: number;
	totalFiles: number;
	loadedFiles: number;
	currentFile: string;
	error: string | null;
	contentCache: ContentCache;
	contentList: ContentItem[];
	isComplete: boolean;
	failedFiles: string[];
}

const initialState: ContentLoadingState = {
	isLoading: false,
	progress: 0,
	totalFiles: 0,
	loadedFiles: 0,
	currentFile: '',
	error: null,
	contentCache: {},
	contentList: [],
	isComplete: false,
	failedFiles: []
};

function createContentLoadingStore() {
	const { subscribe, update, set } = writable<ContentLoadingState>(initialState);

	return {
		subscribe,
		startLoading: async () => {
			update((state) => ({
				...state,
				isLoading: true,
				progress: 0,
				loadedFiles: 0,
				error: null,
				isComplete: false
			}));

			try {
				// Initialize cache
				await cacheStore.init();

				// Step 1: Get content list
				update((state) => ({
					...state,
					currentFile: 'Loading content list...'
				}));

				const contentResponse: ContentResponse = await cdsApi.getContent();

				update((state) => ({
					...state,
					contentList: contentResponse.content,
					totalFiles: contentResponse.totalFiles
				}));

				// Step 2: Load all files with cache-first strategy (parallel with concurrency)
				const files = contentResponse.content.filter((item) => item.type === 'file');
				const contentCache: ContentCache = {};
				const failedFiles: string[] = [];
				const maxRetries = 3;
				const retryDelay = 1000; // 1 second
				const concurrency = 6;
				let completed = 0;

				async function processFile(file: ContentItem): Promise<void> {
					update((state) => ({
						...state,
						currentFile: file.name
					}));
					let blob: Blob | null = await cacheStore.getFile(file.path);
					if (blob) {
						contentCache[file.path] = blob;
					} else {
						let retryCount = 0;
						while (retryCount < maxRetries && !blob) {
							try {
								blob = await cdsApi.getFile(file.path);
								await cacheStore.setFile(file.path, blob);
								contentCache[file.path] = blob;
							} catch (error) {
								retryCount++;
								console.warn(
									`Failed to load file: ${file.path} (attempt ${retryCount}/${maxRetries})`,
									error
								);
								if (retryCount < maxRetries) {
									await new Promise((resolve) => setTimeout(resolve, retryDelay));
								} else {
									console.error(
										`CRITICAL: Failed to load file after ${maxRetries} attempts: ${file.path}`
									);
									failedFiles.push(file.path);
								}
							}
						}
					}
					completed++;
					update((state) => ({
						...state,
						loadedFiles: completed,
						progress: Math.floor((completed / files.length) * 100)
					}));
				}

				let index = 0;
				async function runNext(): Promise<void> {
					if (index >= files.length) return;
					const file = files[index++];
					await processFile(file);
					return runNext();
				}
				const workers = Array.from({ length: Math.min(concurrency, files.length) }, () =>
					runNext()
				);
				await Promise.all(workers);

				// Step 3: Complete loading
				update((state) => ({
					...state,
					isLoading: false,
					progress: 100,
					contentCache,
					failedFiles,
					isComplete: true,
					currentFile:
						failedFiles.length > 0
							? `Loading complete! (${failedFiles.length} files failed)`
							: 'Loading complete!'
				}));
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					error: error instanceof Error ? error.message : 'Failed to load content',
					isComplete: false
				}));
			}
		},
		getFile: (path: string): Blob | null => {
			let cache: ContentCache = {};
			subscribe((state) => (cache = state.contentCache))();
			return cache[path] || null;
		},
		getFileUrl: (path: string): string | null => {
			const blob = contentLoadingStore.getFile(path);
			return blob ? URL.createObjectURL(blob) : null;
		},
		reset: () => {
			set(initialState);
		},

		getFailedFiles: () => {
			let failedFiles: string[] = [];
			subscribe((state) => {
				failedFiles = state.failedFiles;
			})();
			return failedFiles;
		},

		// Cache management methods
		async clearCache(): Promise<void> {
			await cacheStore.clearCache();
		},

		async getCacheStats() {
			return await cacheStore.getStats();
		},

		async cleanupCache(maxAge?: number): Promise<number> {
			return await cacheStore.cleanup(maxAge);
		},

		async getCachedFileUrl(path: string): Promise<string | null> {
			return await cacheStore.getFileUrl(path);
		}
	};
}

export const contentLoadingStore = createContentLoadingStore();
