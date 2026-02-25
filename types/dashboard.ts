// GitHubコミット関連の型
export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitHubStats {
  totalCommits: number;
  commitsByDay: Array<{ date: string; count: number }>;
  lastCommit: GitHubCommit | null;
  streakDays: number;
  averageCommitsPerDay: number;
}

export interface GitHubResponse {
  success: boolean;
  stats: GitHubStats;
  commits: GitHubCommit[];
}

// Learning Session関連の型
export interface LearningSession {
  id: string;
  timestamp: string;
  textPreview: string;
  reactions: {
    total: number;
    byType: Record<string, number>;
    hasOwnerFeedback: boolean;
  };
  qualityScore: number;
  hasSelfAudit: boolean;
  hasActionPlan: boolean;
  url: string;
}

export interface LearningSessionStats {
  totalSessions: number;
  sessionsByDay: Array<{ date: string; count: number }>;
  averageQualityScore: number;
  feedbackRate: number;
  lastSession: LearningSession | null;
}

export interface LearningSessionResponse {
  success: boolean;
  stats: LearningSessionStats;
  sessions: LearningSession[];
}

// システム健全性関連の型
export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'running' | 'completed' | 'pending' | 'failed';
  lastRun: string;
  successRate: number;
  channel: string;
}

export interface ModelUsage {
  model: string;
  usage: number; // パーセンテージ
  cost: number; // 日次コスト（USD）
}

export interface SystemHealth {
  overallScore: number;
  runningJobs: number;
  totalJobs: number;
  uptime: string;
  lastError: string | null;
  recommendations: string[];
}

export interface CostAnalysis {
  dailyCost: number;
  monthlyEstimate: number;
  costPerRequest: number;
  optimizationPotential: number;
  recommendations: string[];
}

export interface GoalProgress {
  current: number;
  target: number;
  status: 'not-started' | 'in-progress' | 'near-complete' | 'completed';
  metrics: string[];
  lastImprovement: string;
}

export interface GoalsProgress {
  g1: GoalProgress;
  g2: GoalProgress;
  g3: GoalProgress;
}

export interface SystemHealthResponse {
  success: boolean;
  timestamp: string;
  systemHealth: SystemHealth;
  costAnalysis: CostAnalysis;
  goalsProgress: GoalsProgress;
  cronJobs: CronJob[];
  modelUsage: ModelUsage[];
}

// ダッシュボード全体の型
export interface DashboardData {
  github: GitHubResponse | null;
  learningSessions: LearningSessionResponse | null;
  systemHealth: SystemHealthResponse | null;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

// ユーティリティ型
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}