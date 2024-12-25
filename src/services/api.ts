const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  error?: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface Group {
  group_id: string;
  name: string;
  description?: string;
  avatar?: string;
  created_at: string;
  member_count: number;
  owner_id: string;
}

export interface Friend {
  user_id: string;
  username: string;
  nickname: string;
  avatar?: string;
  status?: string;
  online?: boolean;
  last_seen?: string;
}

class ApiService {
  private refreshPromise: Promise<string> | null = null;

  private async refreshToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const data = await response.json();
          if (data.code === 200) {
            localStorage.setItem('token', data.data.token);
            return data.data.token;
          }
          throw new Error('Token refresh failed');
        } finally {
          this.refreshPromise = null;
        }
      })();
    }

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        const data = await response.json();

        // 处理特定状态码
        switch (response.status) {
          case 401:
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
            throw new Error('Unauthorized');
          case 403:
            throw new Error('Permission denied');
          case 404:
            throw new Error('Resource not found');
          case 500:
            // 服务器错误时尝试重试
            if (i < retries - 1) continue;
            throw new Error('Server error');
        }

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Request failed');
        }

        return data;
      } catch (error) {
        if (i === retries - 1) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Network error');
        }
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw new Error('Maximum retries exceeded');
  }

  private async handleResponse(response: Response) {
    const data = await response.json();

    if (response.status === 401) {
      // Token 过期或无效
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  auth = {
    login: (data: LoginRequest) =>
      this.request('/v1/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    register: (data: RegisterRequest) =>
      this.request('/v1/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => this.request('/user/profile'),
  };

  user = {
    updateProfile: (data: {
      username?: string;
      avatar?: string;
      phone?: string;
    }) =>
      this.request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  chat = {
    sendMessage: (data: {
      type: 'text' | 'image' | 'file';
      content: string;
      receiver_id?: string;
      group_id?: string;
    }) =>
      this.request('/chat/message', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMessages: (params: {
      receiver_id?: string;
      group_id?: string;
      limit?: number;
      offset?: number;
    }) =>
      this.request('/chat/messages?' + new URLSearchParams(params)),

    recallMessage: (messageId: string) =>
      this.request(`/chat/messages/${messageId}/recall`, {
        method: 'POST',
      }),
  };

  upload = {
    file: async (file: File, type: 'avatar' | 'message') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
  };

  groups = {
    getGroups: () =>
      this.request<Group[]>('/groups'),

    createGroup: (data: { name: string; description?: string }) =>
      this.request<Group>('/groups', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getGroupDetails: (groupId: string) =>
      this.request<Group>(`/groups/${groupId}`),

    updateGroup: (groupId: string, data: { name?: string; description?: string }) =>
      this.request<Group>(`/groups/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteGroup: (groupId: string) =>
      this.request(`/groups/${groupId}`, {
        method: 'DELETE',
      }),

    getMembers: (groupId: string) =>
      this.request(`/groups/${groupId}/members`),

    addMember: (groupId: string, userId: string) =>
      this.request(`/groups/${groupId}/members`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }),

    removeMember: (groupId: string, userId: string) =>
      this.request(`/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
      }),
  };

  friends = {
    getFriends: () =>
      this.request<Friend[]>('/friends'),

    addFriend: (userId: string) =>
      this.request<Friend>('/friends', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }),

    removeFriend: (userId: string) =>
      this.request(`/friends/${userId}`, {
        method: 'DELETE',
      }),

    searchUser: (query: string) =>
      this.request<{
        user: {
          user_id: string;
          username: string;
          email: string;
          phone?: string;
          avatar?: string;
          created_at: string;
        };
      }>(`/v1/user/search?query=${String(query)}`),
  };

  // 其他 API 方法...
}

export const api = new ApiService(); 