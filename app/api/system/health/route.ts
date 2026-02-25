import { NextRequest, NextResponse } from 'next/server';

// ダミーデータ（実際にはOpenClawログから取得）
const MOCK_CRON_JOBS = [
  { 
    id: 'learning-session',
    name: 'Learning Session',
    schedule: '毎4時間',
    status: 'running',
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
    successRate: 95,
    channel: '#learning'
  },
  { 
    id: 'ai-news-daily',
    name: 'AI News Daily',
    schedule: '21:00 SGT',
    status: 'completed',
    lastRun: new Date().toISOString().split('T')[0] + 'T13:00:00Z', // 今日21:00 SGT
    successRate: 85,
    channel: '#ai-news'
  },
  { 
    id: 'openclaw-monitor',
    name: 'OpenClaw Monitor',
    schedule: '21:20 SGT',
    status: 'completed',
    lastRun: new Date().toISOString().split('T')[0] + 'T13:20:00Z',
    successRate: 90,
    channel: '#ai-news'
  },
  { 
    id: 'workspace-backup',
    name: 'Workspace Backup',
    schedule: '23:00 SGT',
    status: 'running',
    lastRun: new Date().toISOString().split('T')[0] + 'T15:00:00Z',
    successRate: 98,
    channel: '#ai-news'
  },
  { 
    id: 'morning-report',
    name: 'Morning Report',
    schedule: '06:00 SGT',
    status: 'pending',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨日
    successRate: 80,
    channel: '#general'
  }
];

const MOCK_MODEL_USAGE = [
  { model: 'Kimi K2.5', usage: 65, cost: 0.02 },
  { model: 'GLM-4.7', usage: 25, cost: 0.05 },
  { model: 'Claude Sonnet 4.5', usage: 8, cost: 0.15 },
  { model: 'DeepSeek Chat', usage: 2, cost: 0.01 }
];

export async function GET(request: NextRequest) {
  try {
    // システム健全性スコア計算
    const systemHealth = calculateSystemHealth();
    
    // コスト分析
    const costAnalysis = calculateCostAnalysis();
    
    // 目標進捗計算（G1-G3）
    const goalsProgress = calculateGoalsProgress();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      systemHealth,
      costAnalysis,
      goalsProgress,
      cronJobs: MOCK_CRON_JOBS,
      modelUsage: MOCK_MODEL_USAGE
    });

  } catch (error) {
    console.error('システム健全性取得エラー:', error);
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    );
  }
}

// システム健全性スコア計算
function calculateSystemHealth() {
  const runningJobs = MOCK_CRON_JOBS.filter(job => job.status === 'running' || job.status === 'completed');
  const successRate = runningJobs.reduce((sum, job) => sum + job.successRate, 0) / runningJobs.length;
  
  return {
    overallScore: Math.round(successRate),
    runningJobs: runningJobs.length,
    totalJobs: MOCK_CRON_JOBS.length,
    uptime: '99.8%', // ダミーデータ
    lastError: null,
    recommendations: successRate < 90 ? ['一部Cronジョブの成功率が低下しています'] : []
  };
}

// コスト分析計算
function calculateCostAnalysis() {
  const totalCost = MOCK_MODEL_USAGE.reduce((sum, model) => sum + model.cost, 0);
  const monthlyEstimate = totalCost * 30; // 日次コストから月次を推定
  
  // 最適化提案
  const recommendations = [];
  const claudeUsage = MOCK_MODEL_USAGE.find(m => m.model.includes('Claude'));
  if (claudeUsage && claudeUsage.usage > 10) {
    recommendations.push('Claude使用率が高いため、GLM/Kimiへの移行を検討してください');
  }
  
  const kimiUsage = MOCK_MODEL_USAGE.find(m => m.model.includes('Kimi'));
  if (kimiUsage && kimiUsage.usage < 70) {
    recommendations.push('Kimi使用率をさらに向上させることでコスト削減が可能です');
  }

  return {
    dailyCost: parseFloat(totalCost.toFixed(3)),
    monthlyEstimate: parseFloat(monthlyEstimate.toFixed(2)),
    costPerRequest: parseFloat((totalCost / 100).toFixed(4)), // 仮に100リクエスト/日と仮定
    optimizationPotential: claudeUsage ? Math.round(claudeUsage.usage * 0.7) : 0, // 70%削減可能と仮定
    recommendations
  };
}

// 目標進捗計算（G1-G3）
function calculateGoalsProgress() {
  // G1: Learning Session品質向上
  const g1Progress = {
    current: 65, // 品質スコアベース
    target: 80,
    status: 'in-progress',
    metrics: ['品質スコア', 'フィードバック率', 'セッション数'],
    lastImprovement: '2026-02-24'
  };

  // G2: 完全自律バックアップ・復旧
  const g2Progress = {
    current: 90, // バックアップ成功率ベース
    target: 100,
    status: 'near-complete',
    metrics: ['バックアップ成功率', '復旧テスト', 'コミット連続日数'],
    lastImprovement: '2026-02-23'
  };

  // G3: コスト最適化
  const g3Progress = {
    current: 75, // コスト削減率ベース
    target: 90,
    status: 'in-progress',
    metrics: ['Anthropic使用率', 'GLM/Kimi比率', '月間コスト'],
    lastImprovement: '2026-02-22'
  };

  return { g1: g1Progress, g2: g2Progress, g3: g3Progress };
}