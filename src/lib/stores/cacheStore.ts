import { writable } from 'svelte/store';

interface CacheItem {
	path: string;
	blob: Blob;
	timestamp: number;
	size: number;
	contentType: string;
}

interface CacheStats {
	totalFiles: number;
	totalSize: number;
	oldestFile: number;
	newestFile: number;
}

interface CacheStoreState {
	isInitialized: boolean;
	isLoading: boolean;
	stats: CacheStats | null;
	error: string | null;
}

const initialState: CacheStoreState = {
	isInitialized: false,
	isLoading: false,
	stats: null,
	error: null
};

class IndexedDBCache {
	private db: IDBDatabase | null = null;
	private dbName = 'pbb-content-cache';
	private dbVersion = 1;
	private storeName = 'files';

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onerror = () => {
				reject(new Error('Failed to open IndexedDB'));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Create object store for files
				if (!db.objectStoreNames.contains(this.storeName)) {
					const store = db.createObjectStore(this.storeName, { keyPath: 'path' });
					store.createIndex('timestamp', 'timestamp', { unique: false });
					store.createIndex('size', 'size', { unique: false });
				}
			};
		});
	}

	async getFile(path: string): Promise<Blob | null> {
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(path);

			request.onsuccess = () => {
				const result = request.result;
				if (result && this.isValidCache(result)) {
					resolve(result.blob);
				} else {
					resolve(null);
				}
			};

			request.onerror = () => {
				reject(new Error(`Failed to get file: ${path}`));
			};
		});
	}

	async setFile(path: string, blob: Blob, contentType?: string): Promise<void> {
		// Auto-detect content type based on file extension
		const detectedContentType = contentType || this.detectContentType(path);
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);

			const cacheItem: CacheItem = {
				path,
				blob,
				timestamp: Date.now(),
				size: blob.size,
				contentType: detectedContentType
			};

			const request = store.put(cacheItem);

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error(`Failed to store file: ${path}`));
			};
		});
	}

	async hasFile(path: string): Promise<boolean> {
		const blob = await this.getFile(path);
		return blob !== null;
	}

	async deleteFile(path: string): Promise<void> {
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(path);

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error(`Failed to delete file: ${path}`));
			};
		});
	}

	async clearCache(): Promise<void> {
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.clear();

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error('Failed to clear cache'));
			};
		});
	}

	async getStats(): Promise<CacheStats> {
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.getAll();

			request.onsuccess = () => {
				const items: CacheItem[] = request.result;
				const validItems = items.filter((item) => this.isValidCache(item));

				const stats: CacheStats = {
					totalFiles: validItems.length,
					totalSize: validItems.reduce((sum, item) => sum + item.size, 0),
					oldestFile:
						validItems.length > 0 ? Math.min(...validItems.map((item) => item.timestamp)) : 0,
					newestFile:
						validItems.length > 0 ? Math.max(...validItems.map((item) => item.timestamp)) : 0
				};

				resolve(stats);
			};

			request.onerror = () => {
				reject(new Error('Failed to get cache stats'));
			};
		});
	}

	async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
		// Cleanup files older than maxAge (default: 7 days)
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const index = store.index('timestamp');
			const cutoff = Date.now() - maxAge;
			const request = index.openCursor(IDBKeyRange.upperBound(cutoff));

			let deletedCount = 0;

			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest).result;
				if (cursor) {
					cursor.delete();
					deletedCount++;
					cursor.continue();
				} else {
					resolve(deletedCount);
				}
			};

			request.onerror = () => {
				reject(new Error('Failed to cleanup cache'));
			};
		});
	}

	private isValidCache(item: CacheItem): boolean {
		// Check if cache item is valid (not expired, has blob, etc.)
		const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
		const isNotExpired = Date.now() - item.timestamp < maxAge;
		const hasBlob = item.blob && item.blob.size > 0;

		return isNotExpired && hasBlob;
	}

	async getFileUrl(path: string): Promise<string | null> {
		const blob = await this.getFile(path);
		return blob ? URL.createObjectURL(blob) : null;
	}

	async revokeFileUrl(url: string): Promise<void> {
		URL.revokeObjectURL(url);
	}

	private detectContentType(path: string): string {
		const extension = path.toLowerCase().split('.').pop() || '';

		// Image types
		if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
			return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
		}

		// Audio types
		if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) {
			return `audio/${extension}`;
		}

		// Video types
		if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
			return `video/${extension}`;
		}

		// Animation types (GIFs are handled above as images)
		if (['apng', 'webp'].includes(extension)) {
			return `image/${extension}`;
		}

		// Default to binary
		return 'application/octet-stream';
	}

	async getFileWithMetadata(
		path: string
	): Promise<{ blob: Blob; contentType: string; size: number } | null> {
		if (!this.db) {
			await this.init();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(path);

			request.onsuccess = () => {
				const result = request.result;
				if (result && this.isValidCache(result)) {
					resolve({
						blob: result.blob,
						contentType: result.contentType,
						size: result.size
					});
				} else {
					resolve(null);
				}
			};

			request.onerror = () => {
				reject(new Error(`Failed to get file metadata: ${path}`));
			};
		});
	}
}

function createCacheStore() {
	const { subscribe, update } = writable<CacheStoreState>(initialState);
	const cache = new IndexedDBCache();

	return {
		subscribe,

		async init(): Promise<void> {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				await cache.init();
				const stats = await cache.getStats();

				update((state) => ({
					...state,
					isInitialized: true,
					isLoading: false,
					stats
				}));
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					error: error instanceof Error ? error.message : 'Failed to initialize cache'
				}));
			}
		},

		async getFile(path: string): Promise<Blob | null> {
			try {
				return await cache.getFile(path);
			} catch (error) {
				console.error('Cache getFile error:', error);
				return null;
			}
		},

		async setFile(path: string, blob: Blob, contentType?: string): Promise<void> {
			try {
				await cache.setFile(path, blob, contentType);

				// Update stats after storing
				const stats = await cache.getStats();
				update((state) => ({ ...state, stats }));
			} catch (error) {
				console.error('Cache setFile error:', error);
				throw error;
			}
		},

		async hasFile(path: string): Promise<boolean> {
			try {
				return await cache.hasFile(path);
			} catch (error) {
				console.error('Cache hasFile error:', error);
				return false;
			}
		},

		async getFileUrl(path: string): Promise<string | null> {
			try {
				return await cache.getFileUrl(path);
			} catch (error) {
				console.error('Cache getFileUrl error:', error);
				return null;
			}
		},

		async clearCache(): Promise<void> {
			try {
				await cache.clearCache();
				update((state) => ({ ...state, stats: null }));
			} catch (error) {
				console.error('Cache clear error:', error);
				throw error;
			}
		},

		async cleanup(maxAge?: number): Promise<number> {
			try {
				const deletedCount = await cache.cleanup(maxAge);
				const stats = await cache.getStats();
				update((state) => ({ ...state, stats }));
				return deletedCount;
			} catch (error) {
				console.error('Cache cleanup error:', error);
				throw error;
			}
		},

		async getStats(): Promise<CacheStats | null> {
			try {
				return await cache.getStats();
			} catch (error) {
				console.error('Cache getStats error:', error);
				return null;
			}
		},

		async getFileWithMetadata(path: string) {
			try {
				return await cache.getFileWithMetadata(path);
			} catch (error) {
				console.error('Cache getFileWithMetadata error:', error);
				return null;
			}
		}
	};
}

export const cacheStore = createCacheStore();
