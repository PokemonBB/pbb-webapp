import { cacheStore } from '$lib/stores/cacheStore';
import { audioPermissionsStore } from '$lib/stores/audioPermissions';

export async function playSound(path: string, volume: number = 0.5): Promise<boolean> {
	try {
		const soundUrl = await cacheStore.getFileUrl(path);

		if (!soundUrl) {
			console.warn(`Sound file not found: ${path}`);
			return false;
		}

		let audioPermitted = false;
		audioPermissionsStore.subscribe((state) => {
			audioPermitted = state.isPermitted;
		})();

		if (!audioPermitted) {
			const permitted = await audioPermissionsStore.requestPermission();
			if (!permitted) {
				console.warn('Audio permissions not granted');
				return false;
			}
		}

		const audio = new Audio(soundUrl);
		audio.volume = Math.max(0, Math.min(1, volume));
		await audio.play();

		return true;
	} catch (error) {
		console.error(`Error playing sound: ${path}`, error);
		return false;
	}
}
