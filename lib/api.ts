import {
  GitHubResponse,
  LearningSessionResponse,
  SystemHealthResponse,
  ApiResponse
} from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// 汎用API呼び出し関数
async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // キャッシュ設定（5分）
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API呼び出しに失敗しました');
    }

    return {
      data: data as T,
      error: null,
      isLoading: false
    };
  } catch (error) {
    console.error(`API呼び出しエラー (${endpoint}):`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      isLoading: false
    };
  }
}

// GitHubコミットデータ取得
export async function fetchGitHubCommits(): Promise<ApiResponse<GitHubResponse>> {
  return fetchApi<GitHubResponse>('/github/commits');
}

// Learning Sessionデータ取得
export async function fetchLearningSessions(): Promise<ApiResponse<LearningSessionResponse>> {
  return fetchApi<LearningSessionResponse>('/slack/learning-sessions');
}

// システム健全性データ取得
export async function fetchSystemHealth(): Promise<ApiResponse<SystemHealthResponse>> {
  return fetchApi<SystemHealthResponse>('/system/health');
}

// 全データを一括取得
export async function fetchAllDashboardData() {
  const [github, learningSessions, systemHealth] = await Promise.all([
    fetchGitHubCommits(),
    fetchLearningSessions(),
    fetchSystemHealth()
  ]);

  return {
    github,
    learningSessions,
    systemHealth,
    lastUpdated: new Date().toISOString(),
    isLoading: github.isLoading || learningSessions.isLoading || systemHealth.isLoading,
    error: github.error || learningSessions.error || systemHealth.error
  };
}

// データ更新関数
export async function refreshDashboardData() {
  return fetchAllDashboardData();
}