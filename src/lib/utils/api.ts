import { config } from '$lib/config/environment';

// Use environment-based configuration
export const API_BASE_URL = config.API_BASE_URL + "/api";

interface LoginRequest {
	username: string;
	password: string;
	rememberMe?: boolean;
}

interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	invitationCode: string;
}

interface ForgotPasswordRequest {
	email: string;
}

interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

interface ApiResponse {
	message: string;
	user?: {
		id: string;
		username: string;
		email: string;
		role: string;
	};
}

interface ForgotPasswordResponse {
	message: string;
	success: boolean;
}

interface ResetPasswordResponse {
	message: string;
	success: boolean;
}

interface ValidateResetTokenResponse {
	valid: boolean;
	message: string;
}

interface UpdateUserRequest {
	username?: string;
	email?: string;
	role?: 'ROOT' | 'ADMIN' | 'USER';
	active?: boolean;
	canInvite?: boolean;
}

interface UpdateUserResponse {
	message: string;
	user: User;
}

interface DeleteUserResponse {
	message: string;
	success: boolean;
}

interface AuditLog {
	_id: string;
	userId: string;
	username: string;
	action: string;
	resource: string;
	resourceId: string;
	oldValues?: Record<string, unknown>;
	newValues?: Record<string, unknown>;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface AuditLogsResponse {
	data: AuditLog[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface GetAuditLogsParams {
	limit?: number;
	page?: number;
}

interface UserProfile {
	_id: string;
	username: string;
	email: string;
	role: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
	configuration: {
		language: string;
		theme: string;
	};
}

interface UserConfiguration {
	language: string;
	theme: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	role: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

interface UsersResponse {
	data: User[];
	pagination: {
		page: string;
		limit: string;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface SearchUsersParams {
	query: string;
	page?: number;
	limit?: number;
}

interface GetUsersParams {
	page?: number;
	limit?: number;
}

type NotificationType = 'notification' | 'info' | 'warning' | 'error' | 'success';

interface CreateNotificationRequest {
	message: string;
	type?: NotificationType;
	receiverId?: string;
	sendToAll?: boolean;
}

interface CreateNotificationResponse {
	message: string;
	success: boolean;
}

interface CreateInvitationRequest {
	expiresInDays?: number;
}

interface CreateInvitationResponse {
	message: string;
	invitation: {
		id: string;
		code: string;
		expiresAt: string;
		createdAt: string;
	};
}

interface ActivateAccountRequest {
	code: string;
}

interface ActivateAccountResponse {
	message: string;
	success: boolean;
	invitationCode?: string;
}

interface ResendActivationRequest {
	email: string;
}

interface ResendActivationResponse {
	message: string;
	success: boolean;
}

interface DeleteMeRequest {
	password: string;
}

interface DeleteMeResponse {
	message: string;
	deleted: boolean;
}

interface UpdateMyUsernameRequest {
	username: string;
}

interface UpdateMyUsernameResponse {
	message: string;
	success: boolean;
	username: string;
}

interface UpdateMyEmailRequest {
	email: string;
}

interface UpdateMyEmailResponse {
	message: string;
	success: boolean;
	email: string;
}

interface UpdateMyPasswordRequest {
	currentPassword: string;
	newPassword: string;
}

interface UpdateMyPasswordResponse {
	message: string;
	success: boolean;
}

interface SendFriendRequestResponse {
	message: string;
	success: boolean;
}

interface AcceptFriendRequestResponse {
	message: string;
	success: boolean;
}

interface DeclineFriendRequestResponse {
	message: string;
	success: boolean;
}

interface Friend {
	_id: string;
	username: string;
	email: string;
	role: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

interface FriendsResponse {
	data: Friend[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface GetFriendsParams {
	page?: number;
	limit?: number;
}

interface FriendRequest {
	_id: string;
	senderId: string;
	receiverId: string;
	sender: {
		_id: string;
		username: string;
		email: string;
	};
	receiver: {
		_id: string;
		username: string;
		email: string;
	};
	status: 'pending' | 'accepted' | 'declined';
	createdAt: string;
	updatedAt: string;
}

interface FriendRequestsResponse {
	data: FriendRequest[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface GetFriendRequestsParams {
	page?: number;
	limit?: number;
}

interface SentFriendRequestsResponse {
	data: FriendRequest[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface GetSentFriendRequestsParams {
	page?: number;
	limit?: number;
}

interface RemoveFriendResponse {
	message: string;
	success: boolean;
}

interface ApiError {
	success: false;
	message: string;
	status: number;
}

interface DocChild {
	name: string;
	type: 'directory' | 'file';
	path: string;
}

interface DocDirectoryResponse {
	name: string;
	type: 'directory';
	path: string;
	content: string;
	children: DocChild[];
}

interface DocFileResponse {
	name: string;
	type: 'file';
	path: string;
	content: string;
}

type DocResponse = DocDirectoryResponse | DocFileResponse;

interface DocSearchResult {
	path: string;
	name: string;
	line: number;
	snippet: string;
}

interface DocsSearchResponse {
	results: DocSearchResult[];
}

interface SearchDocsParams {
	q: string;
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

	async login(credentials: LoginRequest): Promise<ApiResponse> {
		return this.makeRequest<ApiResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async register(userData: RegisterRequest): Promise<ApiResponse> {
		return this.makeRequest<ApiResponse>('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async forgotPassword(emailData: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
		return this.makeRequest<ForgotPasswordResponse>('/auth/forgot-password', {
			method: 'POST',
			body: JSON.stringify(emailData),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async resetPassword(resetData: ResetPasswordRequest): Promise<ResetPasswordResponse> {
		return this.makeRequest<ResetPasswordResponse>('/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify(resetData),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async validateResetToken(token: string): Promise<ValidateResetTokenResponse> {
		return this.makeRequest<ValidateResetTokenResponse>(`/auth/validate-reset-token/${token}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async updateAdminUser(id: string, userData: UpdateUserRequest): Promise<UpdateUserResponse> {
		return this.makeRequest<UpdateUserResponse>(`/admin/users/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(userData),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async deleteAdminUser(id: string): Promise<DeleteUserResponse> {
		return this.makeRequest<DeleteUserResponse>(`/admin/users/${id}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getAuditLogs(params?: GetAuditLogsParams): Promise<AuditLogsResponse> {
		const searchParams = new URLSearchParams();
		if (params?.limit) searchParams.append('limit', params.limit.toString());
		if (params?.page) searchParams.append('page', params.page.toString());

		const queryString = searchParams.toString();
		const url = queryString ? `/audit?${queryString}` : '/audit';

		return this.makeRequest<AuditLogsResponse>(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async logout(): Promise<ApiResponse> {
		return this.makeRequest<ApiResponse>('/auth/logout', {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async verify(): Promise<ApiResponse> {
		return this.makeRequest<ApiResponse>('/auth/verify', {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getUserProfile(): Promise<{ message: string; user: UserProfile }> {
		return this.makeRequest<{ message: string; user: UserProfile }>('/users/me', {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async updateUserConfiguration(configuration: UserConfiguration): Promise<UserProfile> {
		return this.makeRequest<UserProfile>('/users/me/configuration', {
			method: 'PATCH',
			body: JSON.stringify(configuration),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async updateMyUsername(data: UpdateMyUsernameRequest): Promise<UpdateMyUsernameResponse> {
		return this.makeRequest<UpdateMyUsernameResponse>('/users/me/username', {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async updateMyEmail(data: UpdateMyEmailRequest): Promise<UpdateMyEmailResponse> {
		return this.makeRequest<UpdateMyEmailResponse>('/users/me/email', {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async updateMyPassword(data: UpdateMyPasswordRequest): Promise<UpdateMyPasswordResponse> {
		return this.makeRequest<UpdateMyPasswordResponse>('/users/me/password', {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString ? `/users?${queryString}` : '/users';

		return this.makeRequest<UsersResponse>(endpoint, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async searchUsers(params: SearchUsersParams): Promise<UsersResponse> {
		const searchParams = new URLSearchParams();
		searchParams.append('query', params.query);
		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());

		return this.makeRequest<UsersResponse>(`/users/search?${searchParams.toString()}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getUserById(id: string): Promise<User> {
		return this.makeRequest<User>(`/users/${id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async createNotification(data: CreateNotificationRequest): Promise<CreateNotificationResponse> {
		return this.makeRequest<CreateNotificationResponse>('/notifications', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async createInvitation(data?: CreateInvitationRequest): Promise<CreateInvitationResponse> {
		return this.makeRequest<CreateInvitationResponse>('/invitations', {
			method: 'POST',
			body: data ? JSON.stringify(data) : JSON.stringify({ expiresInDays: 7 }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async deleteCurrentUser(data: DeleteMeRequest): Promise<DeleteMeResponse> {
		return this.makeRequest<DeleteMeResponse>('/users/me', {
			method: 'DELETE',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async activateAccount(data: ActivateAccountRequest): Promise<ActivateAccountResponse> {
		return this.makeRequest<ActivateAccountResponse>('/activation/activate', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async resendActivation(data: ResendActivationRequest): Promise<ResendActivationResponse> {
		return this.makeRequest<ResendActivationResponse>('/activation/resend', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}

	async sendFriendRequest(receiverId: string): Promise<SendFriendRequestResponse> {
		return this.makeRequest<SendFriendRequestResponse>(`/friends/request/${receiverId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async acceptFriendRequest(requestId: string): Promise<AcceptFriendRequestResponse> {
		return this.makeRequest<AcceptFriendRequestResponse>(`/friends/accept/${requestId}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async declineFriendRequest(requestId: string): Promise<DeclineFriendRequestResponse> {
		return this.makeRequest<DeclineFriendRequestResponse>(`/friends/decline/${requestId}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getFriends(params: GetFriendsParams = {}): Promise<FriendsResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString ? `/friends?${queryString}` : '/friends';

		return this.makeRequest<FriendsResponse>(endpoint, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getFriendRequests(params: GetFriendRequestsParams = {}): Promise<FriendRequestsResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString ? `/friends/requests?${queryString}` : '/friends/requests';

		return this.makeRequest<FriendRequestsResponse>(endpoint, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getSentFriendRequests(
		params: GetSentFriendRequestsParams = {}
	): Promise<SentFriendRequestsResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString ? `/friends/sent?${queryString}` : '/friends/sent';

		return this.makeRequest<SentFriendRequestsResponse>(endpoint, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async removeFriend(friendId: string): Promise<RemoveFriendResponse> {
		return this.makeRequest<RemoveFriendResponse>(`/friends/${friendId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getDocsRoot(): Promise<DocResponse> {
		return this.makeRequest<DocResponse>('/docs', {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async getDocsByPath(path: string): Promise<DocResponse> {
		const normalizedPath = path.replace(/^\//, '').trim();
		const endpoint = normalizedPath ? `/docs/${normalizedPath}` : '/docs';
		return this.makeRequest<DocResponse>(endpoint, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async searchDocs(params: SearchDocsParams): Promise<DocsSearchResponse> {
		const searchParams = new URLSearchParams();
		searchParams.append('q', params.q);

		return this.makeRequest<DocsSearchResponse>(`/docs/search?${searchParams.toString()}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
	}
}

export const apiClient = new ApiClient(API_BASE_URL);

export const authApi = {
	login: (credentials: LoginRequest) => apiClient.login(credentials),
	register: (userData: RegisterRequest) => apiClient.register(userData),
	logout: () => apiClient.logout(),
	verify: () => apiClient.verify(),
	forgotPassword: (emailData: ForgotPasswordRequest) => apiClient.forgotPassword(emailData),
	resetPassword: (resetData: ResetPasswordRequest) => apiClient.resetPassword(resetData),
	validateResetToken: (token: string) => apiClient.validateResetToken(token)
};

export const userApi = {
	getProfile: () => apiClient.getUserProfile(),
	updateConfiguration: (configuration: UserConfiguration) =>
		apiClient.updateUserConfiguration(configuration),
	updateMyUsername: (data: UpdateMyUsernameRequest) => apiClient.updateMyUsername(data),
	updateMyEmail: (data: UpdateMyEmailRequest) => apiClient.updateMyEmail(data),
	updateMyPassword: (data: UpdateMyPasswordRequest) => apiClient.updateMyPassword(data),
	getUsers: (params?: GetUsersParams) => apiClient.getUsers(params),
	searchUsers: (params: SearchUsersParams) => apiClient.searchUsers(params),
	getUserById: (id: string) => apiClient.getUserById(id),
	deleteMe: (data: DeleteMeRequest) => apiClient.deleteCurrentUser(data)
};

export const adminApi = {
	updateUser: (id: string, userData: UpdateUserRequest) => apiClient.updateAdminUser(id, userData),
	deleteUser: (id: string) => apiClient.deleteAdminUser(id)
};

export const auditApi = {
	getAuditLogs: (params?: GetAuditLogsParams) => apiClient.getAuditLogs(params)
};

export const notificationApi = {
	create: (data: CreateNotificationRequest) => apiClient.createNotification(data)
};

export const invitationApi = {
	create: (data?: CreateInvitationRequest) => apiClient.createInvitation(data)
};

export const activationApi = {
	activate: (data: ActivateAccountRequest) => apiClient.activateAccount(data),
	resend: (data: ResendActivationRequest) => apiClient.resendActivation(data)
};

export const friendsApi = {
	sendRequest: (receiverId: string) => apiClient.sendFriendRequest(receiverId),
	acceptRequest: (requestId: string) => apiClient.acceptFriendRequest(requestId),
	declineRequest: (requestId: string) => apiClient.declineFriendRequest(requestId),
	getFriends: (params?: GetFriendsParams) => apiClient.getFriends(params),
	getRequests: (params?: GetFriendRequestsParams) => apiClient.getFriendRequests(params),
	getSentRequests: (params?: GetSentFriendRequestsParams) =>
		apiClient.getSentFriendRequests(params),
	removeFriend: (friendId: string) => apiClient.removeFriend(friendId)
};

export const docsApi = {
	getRoot: () => apiClient.getDocsRoot(),
	getByPath: (path: string) => apiClient.getDocsByPath(path),
	search: (params: SearchDocsParams) => apiClient.searchDocs(params)
};

export type {
	NotificationType,
	CreateNotificationRequest,
	CreateNotificationResponse,
	LoginRequest,
	RegisterRequest,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	ValidateResetTokenResponse,
	UpdateUserRequest,
	UpdateUserResponse,
	DeleteUserResponse,
	AuditLog,
	AuditLogsResponse,
	GetAuditLogsParams,
	ApiResponse,
	ApiError,
	UserProfile,
	UserConfiguration,
	User,
	UsersResponse,
	SearchUsersParams,
	GetUsersParams,
	CreateInvitationRequest,
	CreateInvitationResponse,
	ActivateAccountRequest,
	ActivateAccountResponse,
	ResendActivationRequest,
	ResendActivationResponse,
	DeleteMeRequest,
	DeleteMeResponse,
	UpdateMyUsernameRequest,
	UpdateMyUsernameResponse,
	UpdateMyEmailRequest,
	UpdateMyEmailResponse,
	UpdateMyPasswordRequest,
	UpdateMyPasswordResponse,
	SendFriendRequestResponse,
	AcceptFriendRequestResponse,
	DeclineFriendRequestResponse,
	Friend,
	FriendsResponse,
	GetFriendsParams,
	FriendRequest,
	FriendRequestsResponse,
	GetFriendRequestsParams,
	SentFriendRequestsResponse,
	GetSentFriendRequestsParams,
	RemoveFriendResponse,
	DocChild,
	DocDirectoryResponse,
	DocFileResponse,
	DocResponse,
	DocSearchResult,
	DocsSearchResponse,
	SearchDocsParams
};
