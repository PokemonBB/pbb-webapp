<script lang="ts">
	import Window from '$lib/components/window/Window.svelte';
	import { translationStore } from '$lib/stores/translations';
	import { createEventDispatcher } from 'svelte';
	import { globalZIndex } from '$lib/components/window/zindex';
	import Loader from '$lib/components/common/Loader.svelte';
	import { friendsApi, userApi, type Friend, type FriendRequest, type User } from '$lib/utils/api';
	import Icon from '$lib/components/common/Icon.svelte';

	interface Props {
		visible?: boolean;
		width?: number;
		height?: number;
		left?: number;
		top?: number;
	}

	let { visible = false, width = 1000, height = 700, left = 0, top = 0 }: Props = $props();

	const dispatch = createEventDispatcher<{ close: void }>();

	let activeTab = $state('friends');
	let loading = $state(false);
	let error = $state('');

	// Friends data
	let friends = $state<Friend[]>([]);
	let friendsPagination = $state({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false
	});

	// Sent requests data
	let sentRequests = $state<FriendRequest[]>([]);
	let sentRequestsPagination = $state({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false
	});

	// Received requests data
	let receivedRequests = $state<FriendRequest[]>([]);
	let receivedRequestsPagination = $state({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false
	});

	// Search data
	let searchQuery = $state('');
	let searchResults = $state<User[]>([]);
	let searchPagination = $state({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false
	});

	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	let searchInputElement = $state<HTMLInputElement | null>(null);
	let lastLoadedTab = $state<string | null>(null);
	let isSearching = $state(false);

	function handleClose() {
		dispatch('close');
	}

	function setActiveTab(tab: string) {
		activeTab = tab;
		loadTabData();
	}

	async function loadTabData() {
		loading = true;
		error = '';

		try {
			switch (activeTab) {
				case 'friends':
					await loadFriends();
					break;
				case 'sent':
					await loadSentRequests();
					break;
				case 'received':
					await loadReceivedRequests();
					break;
				case 'search':
					if (searchQuery.trim()) {
						await searchUsers();
					}
					break;
			}
		} catch (err: any) {
			error = err.message || 'Error loading data';
		} finally {
			loading = false;
		}
	}

	async function loadFriends(page = 1) {
		const response = await friendsApi.getFriends({ page, limit: friendsPagination.limit });

		friends = response.data || (response as any).data || [];

		if (response.pagination) {
			friendsPagination = {
				page: Number(response.pagination.page),
				limit: Number(response.pagination.limit),
				total: response.pagination.total,
				totalPages: response.pagination.totalPages,
				hasNext: response.pagination.hasNext,
				hasPrev: response.pagination.hasPrev
			};
		}
	}

	async function loadSentRequests(page = 1) {
		const response = await friendsApi.getSentRequests({
			page,
			limit: sentRequestsPagination.limit
		});

		sentRequests = response.data || (response as any).data || [];

		if (response.pagination) {
			sentRequestsPagination = {
				page: Number(response.pagination.page),
				limit: Number(response.pagination.limit),
				total: response.pagination.total,
				totalPages: response.pagination.totalPages,
				hasNext: response.pagination.hasNext,
				hasPrev: response.pagination.hasPrev
			};
		}
	}

	async function loadReceivedRequests(page = 1) {
		const response = await friendsApi.getRequests({
			page,
			limit: receivedRequestsPagination.limit
		});

		receivedRequests = response.data || (response as any).data || [];

		if (response.pagination) {
			receivedRequestsPagination = {
				page: Number(response.pagination.page),
				limit: Number(response.pagination.limit),
				total: response.pagination.total,
				totalPages: response.pagination.totalPages,
				hasNext: response.pagination.hasNext,
				hasPrev: response.pagination.hasPrev
			};
		}
	}

	async function searchUsers(page = 1) {
		if (!searchQuery.trim()) return;

		const response = await userApi.searchUsers({
			query: searchQuery,
			page,
			limit: searchPagination.limit
		});

		// Handle both response types: UsersResponse or array
		if (Array.isArray(response)) {
			searchResults = response || [];
			searchPagination = {
				page: 1,
				limit: 10,
				total: searchResults.length,
				totalPages: 1,
				hasNext: false,
				hasPrev: false
			};
		} else {
			searchResults = response.data || [];

			if (response.pagination) {
				searchPagination = {
					page: Number(response.pagination.page),
					limit: Number(response.pagination.limit),
					total: response.pagination.total,
					totalPages: response.pagination.totalPages,
					hasNext: response.pagination.hasNext,
					hasPrev: response.pagination.hasPrev
				};
			} else {
				// Fallback if pagination is not provided
				searchPagination = {
					page: 1,
					limit: 10,
					total: searchResults.length,
					totalPages: 1,
					hasNext: false,
					hasPrev: false
				};
			}
		}
	}

	async function sendFriendRequest(userId: string) {
		try {
			await friendsApi.sendRequest(userId);
			await searchUsers(searchPagination.page);
		} catch (err: any) {
			error = err.message || 'Error sending friend request';
		}
	}

	async function acceptRequest(requestId: string) {
		try {
			await friendsApi.acceptRequest(requestId);
			await loadReceivedRequests(receivedRequestsPagination.page);
		} catch (err: any) {
			error = err.message || 'Error accepting request';
		}
	}

	async function declineRequest(requestId: string) {
		try {
			await friendsApi.declineRequest(requestId);
			await loadReceivedRequests(receivedRequestsPagination.page);
		} catch (err: any) {
			error = err.message || 'Error declining request';
		}
	}

	async function removeFriend(friendId: string) {
		try {
			await friendsApi.removeFriend(friendId);
			await loadFriends(friendsPagination.page);
		} catch (err: any) {
			error = err.message || 'Error removing friend';
		}
	}

	function handleSearch() {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (searchQuery.trim()) {
			isSearching = true;
			searchPagination.page = 1;
			searchUsers().finally(() => {
				isSearching = false;
			});
		} else {
			searchResults = [];
			isSearching = false;
		}
	}

	function handleSearchChange() {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (!searchQuery.trim()) {
			searchResults = [];
			searchPagination.page = 1;
			isSearching = false;
			return;
		}

		isSearching = true;
		searchTimeout = setTimeout(async () => {
			try {
				searchPagination.page = 1;
				await searchUsers();
			} catch (err: any) {
				error = err.message || 'Error searching users';
			} finally {
				isSearching = false;
			}
		}, 500);
	}

	// Bring window to front when it becomes visible
	$effect(() => {
		if (visible) {
			globalZIndex.update((n) => n + 1);
		}
	});

	// Load data when tab changes (only load once per tab)
	$effect(() => {
		if (visible && activeTab && lastLoadedTab !== activeTab) {
			lastLoadedTab = activeTab;
			loadTabData();
		}
	});

	// Cleanup timeout on unmount
	$effect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});
</script>

{#if visible}
	<Window
		title={$translationStore.translations?.friends.windowTitle || 'Friends'}
		icon="users"
		{width}
		{height}
		{left}
		{top}
		{visible}
		on:close={handleClose}
	>
		<div class="friends-window" style="color: var(--text-primary);">
			<!-- Tab Navigation -->
			<div class="tab-navigation">
				<button
					class="tab-button"
					class:active={activeTab === 'friends'}
					onclick={() => setActiveTab('friends')}
				>
					{$translationStore.translations?.friends.tabs.friends || 'Friends'}
				</button>
				<button
					class="tab-button"
					class:active={activeTab === 'sent'}
					onclick={() => setActiveTab('sent')}
				>
					{$translationStore.translations?.friends.tabs.sent || 'Sent'}
				</button>
				<button
					class="tab-button"
					class:active={activeTab === 'received'}
					onclick={() => setActiveTab('received')}
				>
					{$translationStore.translations?.friends.tabs.received || 'Received'}
				</button>
				<button
					class="tab-button"
					class:active={activeTab === 'search'}
					onclick={() => setActiveTab('search')}
				>
					{$translationStore.translations?.friends.tabs.search || 'Search'}
				</button>
			</div>

			<!-- Error Message -->
			{#if error}
				<div class="error-message">
					{error}
				</div>
			{/if}

			<!-- Tab Content -->
			<div class="tab-content">
				{#if loading}
					<div class="loading-container">
						<Loader size="medium" />
					</div>
				{:else if activeTab === 'friends'}
					<!-- Friends Tab -->
					<div class="friends-list">
						{#if !friends || friends.length === 0}
							<div class="empty-state">
								{$translationStore.translations?.friends.messages.noFriends || 'No friends yet'}
							</div>
						{:else}
							{#each friends as friend}
								<div class="friend-item">
									<div class="friend-info">
										<div class="friend-name">{friend.username}</div>
										<div class="friend-email">{friend.email}</div>
									</div>
									<button class="remove-button" onclick={() => removeFriend(friend._id)}>
										<Icon name="user-minus" size="medium" />
									</button>
								</div>
							{/each}
						{/if}

						<!-- Pagination -->
						{#if friendsPagination.totalPages > 1}
							<div class="pagination">
								<button
									disabled={!friendsPagination.hasPrev}
									onclick={() => loadFriends(friendsPagination.page - 1)}
								>
									{$translationStore.translations?.friends.actions.previous || 'Previous'}
								</button>
								<span
									>{$translationStore.translations?.friends.messages.page || 'Page'}
									{friendsPagination.page} of {friendsPagination.totalPages}</span
								>
								<button
									disabled={!friendsPagination.hasNext}
									onclick={() => loadFriends(friendsPagination.page + 1)}
								>
									{$translationStore.translations?.friends.actions.next || 'Next'}
								</button>
							</div>
						{/if}
					</div>
				{:else if activeTab === 'sent'}
					<!-- Sent Requests Tab -->
					<div class="requests-list">
						{#if !sentRequests || sentRequests.length === 0}
							<div class="empty-state">
								{$translationStore.translations?.friends.messages.noSentRequests ||
									'No sent requests'}
							</div>
						{:else}
							{#each sentRequests as request}
								<div class="request-item">
									<div class="request-info">
										<div class="request-name">{request.receiver.username}</div>
										<div class="request-email">{request.receiver.email}</div>
										<div class="request-status">
											{$translationStore.translations?.friends.messages.status || 'Status:'}
											{$translationStore.translations?.friends.status[request.status] ||
												request.status}
										</div>
									</div>
								</div>
							{/each}
						{/if}

						<!-- Pagination -->
						{#if sentRequestsPagination.totalPages > 1}
							<div class="pagination">
								<button
									disabled={!sentRequestsPagination.hasPrev}
									onclick={() => loadSentRequests(sentRequestsPagination.page - 1)}
								>
									{$translationStore.translations?.friends.actions.previous || 'Previous'}
								</button>
								<span
									>{$translationStore.translations?.friends.messages.page || 'Page'}
									{sentRequestsPagination.page} of {sentRequestsPagination.totalPages}</span
								>
								<button
									disabled={!sentRequestsPagination.hasNext}
									onclick={() => loadSentRequests(sentRequestsPagination.page + 1)}
								>
									{$translationStore.translations?.friends.actions.next || 'Next'}
								</button>
							</div>
						{/if}
					</div>
				{:else if activeTab === 'received'}
					<!-- Received Requests Tab -->
					<div class="requests-list">
						{#if !receivedRequests || receivedRequests.length === 0}
							<div class="empty-state">
								{$translationStore.translations?.friends.messages.noReceivedRequests ||
									'No received requests'}
							</div>
						{:else}
							{#each receivedRequests as request}
								<div class="request-item">
									<div class="request-info">
										<div class="request-name">
											{request.sender?.username ||
												(request as any).requester?.username ||
												'Unknown'}
										</div>
										<div class="request-email">
											{request.sender?.email || (request as any).requester?.email || ''}
										</div>
									</div>
									<div class="request-actions">
										<button class="accept-button" onclick={() => acceptRequest(request._id)}>
											<Icon name="checkbox" size="medium" />
										</button>
										<button class="decline-button" onclick={() => declineRequest(request._id)}>
											<Icon name="closebox" size="medium" />
										</button>
									</div>
								</div>
							{/each}
						{/if}

						<!-- Pagination -->
						{#if receivedRequestsPagination.totalPages > 1}
							<div class="pagination">
								<button
									disabled={!receivedRequestsPagination.hasPrev}
									onclick={() => loadReceivedRequests(receivedRequestsPagination.page - 1)}
								>
									{$translationStore.translations?.friends.actions.previous || 'Previous'}
								</button>
								<span
									>{$translationStore.translations?.friends.messages.page || 'Page'}
									{receivedRequestsPagination.page} of {receivedRequestsPagination.totalPages}</span
								>
								<button
									disabled={!receivedRequestsPagination.hasNext}
									onclick={() => loadReceivedRequests(receivedRequestsPagination.page + 1)}
								>
									{$translationStore.translations?.friends.actions.next || 'Next'}
								</button>
							</div>
						{/if}
					</div>
				{:else if activeTab === 'search'}
					<!-- Search Tab -->
					<div class="search-section">
						<div class="search-input">
							<input
								type="text"
								bind:value={searchQuery}
								placeholder={$translationStore.translations?.friends.messages.searchPlaceholder ||
									'Search users...'}
								autocomplete="off"
								autocapitalize="off"
								autocorrect="off"
								spellcheck={false}
								oninput={handleSearchChange}
								bind:this={searchInputElement}
							/>
							<button onclick={handleSearch}
								>{$translationStore.translations?.friends.actions.search || 'Search'}</button
							>
						</div>

						{#if (loading && activeTab === 'search') || isSearching}
							<div class="loading-container">
								<Loader size="medium" />
							</div>
						{:else if searchResults && searchResults.length > 0}
							<div class="search-results">
								{#each searchResults as user}
									<div class="user-item">
										<div class="user-info">
											<div class="user-name">{user.username}</div>
											<div class="user-email">{user.email}</div>
										</div>
										<button class="add-button" onclick={() => sendFriendRequest(user._id)}>
											<Icon name="user-plus" />
										</button>
									</div>
								{/each}
							</div>

							<!-- Pagination -->
							{#if searchPagination.totalPages > 1}
								<div class="pagination">
									<button
										disabled={!searchPagination.hasPrev}
										onclick={() => searchUsers(searchPagination.page - 1)}
									>
										{$translationStore.translations?.friends.actions.previous || 'Previous'}
									</button>
									<span
										>{$translationStore.translations?.friends.messages.page || 'Page'}
										{searchPagination.page} of {searchPagination.totalPages}</span
									>
									<button
										disabled={!searchPagination.hasNext}
										onclick={() => searchUsers(searchPagination.page + 1)}
									>
										{$translationStore.translations?.friends.actions.next || 'Next'}
									</button>
								</div>
							{/if}
						{:else if searchQuery.trim()}
							<div class="empty-state">
								{$translationStore.translations?.friends.messages.noUsersFound || 'No users found'}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Window>
{/if}

<style>
	.friends-window {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--bg-secondary);
	}

	.tab-navigation {
		display: flex;
		border-bottom: 1px solid var(--border-primary);
		margin-bottom: 16px;
		background: var(--bg-tertiary);
	}

	.tab-button {
		flex: 1;
		padding: 12px 16px;
		border: none;
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tab-button:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.tab-button.active {
		background: var(--bg-secondary);
		border-bottom-color: var(--accent-primary);
		color: var(--accent-primary);
	}

	.tab-content {
		flex: 1;
		overflow-y: auto;
		background: var(--bg-secondary);
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
	}

	.error-message {
		background: var(--error-bg);
		color: var(--error-text);
		padding: 12px;
		border-radius: 4px;
		margin-bottom: 16px;
		border: 1px solid var(--error-border);
	}

	.empty-state {
		text-align: center;
		color: var(--text-tertiary);
		padding: 40px;
		font-style: italic;
	}

	.friend-item,
	.request-item,
	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		border-bottom: 1px solid var(--border-primary);
		background: var(--bg-secondary);
	}

	.friend-item:hover,
	.request-item:hover,
	.user-item:hover {
		background: var(--bg-tertiary);
	}

	.friend-info,
	.request-info,
	.user-info {
		flex: 1;
	}

	.friend-name,
	.request-name,
	.user-name {
		font-weight: 600;
		margin-bottom: 4px;
		color: var(--text-primary);
	}

	.friend-email,
	.request-email,
	.user-email {
		color: var(--text-secondary);
		font-size: 0.9em;
	}

	.request-status {
		color: var(--accent-primary);
		font-size: 0.8em;
		margin-top: 4px;
	}

	.request-actions {
		display: flex;
		gap: 8px;
	}

	button {
		padding: 6px 12px;
		border: 1px solid var(--border-secondary);
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9em;
		transition: all 0.2s;
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	button:hover {
		opacity: 0.8;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.remove-button {
		background: var(--error-text);
		color: white;
		border-color: var(--error-text);
	}

	.accept-button {
		background: var(--success-text);
		color: white;
		border-color: var(--success-text);
	}

	.decline-button {
		background: var(--error-text);
		color: white;
		border-color: var(--error-text);
	}

	.add-button {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
	}

	.search-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.search-input {
		display: flex;
		gap: 8px;
	}

	.search-input input {
		flex: 1;
		padding: 8px 12px;
		border: 1px solid var(--border-secondary);
		border-radius: 4px;
		font-size: 0.9em;
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.search-input input::placeholder {
		color: var(--text-tertiary);
	}

	.search-input button {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
		padding: 8px 16px;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
		margin-top: 20px;
		padding: 16px;
		border-top: 1px solid var(--border-primary);
		background: var(--bg-secondary);
	}

	.pagination button {
		padding: 8px 16px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-secondary);
		color: var(--text-primary);
	}

	.pagination span {
		color: var(--text-secondary);
		font-size: 0.9em;
	}
</style>
