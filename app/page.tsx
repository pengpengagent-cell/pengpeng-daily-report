"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoalProgressCard } from '@/components/goal-progress-card';
import { fetchAllDashboardData, refreshDashboardData } from '@/lib/api';
import { DashboardData } from '@/types/dashboard';
import { RefreshCw, AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    github: null,
    learningSessions: null,
    systemHealth: null,
    lastUpdated: new Date().toISOString(),
    isLoading: true,
    error: null
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 初期データ読み込み
  useEffect(() => {
    loadDashboardData();
  }, []);

  // データ読み込み関数
  const loadDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchAllDashboardData();
      setDashboardData(data);
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'データ読み込みに失敗しました',
        isLoading: false
      }));
    }
  };

  // データ更新関数
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await refreshDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('データ更新エラー:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 日付フォーマット
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const lastUpdated = new Date(dashboardData.lastUpdated).toLocaleTimeString('ja-JP');

  // システム健全性の計算
  const systemHealth = dashboardData.systemHealth?.data;
  const goalsProgress = systemHealth?.goalsProgress;

  // 統計情報の計算
  const stats = {
    totalCronJobs: systemHealth?.cronJobs.length || 0,
    runningJobs: systemHealth?.cronJobs.filter(job => 
      job.status === 'running' || job.status === 'completed'
    ).length || 0,
    systemHealthScore: systemHealth?.systemHealth.overallScore || 0,
    dailyCost: systemHealth?.costAnalysis.dailyCost || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                PengPeng Daily Report 2.0
              </h1>
              <p className="text-gray-600 mt-2">
                Active Goals進捗ダッシュボード
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing || dashboardData.isLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? '更新中...' : '更新'}
              </Button>
              <Badge variant="outline" className="text-sm">
                v2.0.0
              </Badge>
            </div>
          </div>

          {/* ステータスカード */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">システム健全性</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.systemHealthScore}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">稼働ジョブ</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.runningJobs}/{stats.totalCronJobs}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">最終更新</p>
                      <p className="text-lg font-bold text-gray-900">
                        {lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">日次コスト</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${stats.dailyCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* メインコンテンツ */}
        <main className="space-y-8">
          {/* Active Goalsセクション */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Goals進捗</h2>
            {dashboardData.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : goalsProgress ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GoalProgressCard
                  goal={goalsProgress.g1}
                  title="Learning Session品質向上"
                  description="Ownerが朝読んで「これは知れてよかった」と感じるレベルにする"
                  goalNumber="G1"
                />
                <GoalProgressCard
                  goal={goalsProgress.g2}
                  title="完全自律バックアップ・復旧"
                  description="ワークスペース破損時にOwner介入ゼロで自力復旧"
                  goalNumber="G2"
                />
                <GoalProgressCard
                  goal={goalsProgress.g3}
                  title="コスト最適化"
                  description="GLM/Kimi最大活用、Anthropic API使用最小化"
                  goalNumber="G3"
                />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600 text-center">
                    Goals進捗データを読み込めませんでした
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* 詳細分析セクション */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">詳細分析</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Session分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Session分析
                  </CardTitle>
                  <CardDescription>
                    セッション品質とOwnerフィードバックの推移
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.learningSessions?.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">総セッション数</p>
                          <p className="text-2xl font-bold">
                            {dashboardData.learningSessions.data.stats.totalSessions}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">平均品質スコア</p>
                          <p className="text-2xl font-bold">
                            {dashboardData.learningSessions.data.stats.averageQualityScore}/100
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">直近のセッション:</p>
                        {dashboardData.learningSessions.data.sessions.slice(0, 3).map(session => (
                          <div key={session.id} className="mb-2 last:mb-0 p-2 bg-white rounded border">
                            <p className="text-sm font-medium">{session.textPreview}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(session.timestamp).toLocaleDateString('ja-JP')}
                              </span>
                              <Badge variant={session.reactions.hasOwnerFeedback ? "default" : "outline"}>
                                {session.reactions.hasOwnerFeedback ? 'フィードバックあり' : 'フィードバック待ち'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      Learning Sessionデータを読み込めませんでした
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* バックアップ健全性 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    バックアップ健全性
                  </CardTitle>
                  <CardDescription>
                    Gitコミット履歴とバックアップ成功率
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.github?.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">連続コミット日数</p>
                          <p className="text-2xl font-bold">
                            {dashboardData.github.data.stats.streakDays}日
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">平均コミット/日</p>
                          <p className="text-2xl font-bold">
                            {dashboardData.github.data.stats.averageCommitsPerDay.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">直近のコミット:</p>
                        {dashboardData.github.data.commits.slice(0, 3).map(commit => (
                          <div key={commit.sha} className="mb-2 last:mb-0 p-2 bg-white rounded border">
                            <p className="text-sm font-medium">{commit.message}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(commit.date).toLocaleDateString('ja-JP')}
                              </span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {commit.sha}
                              </code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      バックアップデータを読み込めませんでした
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* システム健全性セクション */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">システム健全性</h2>
            {systemHealth ? (
              <div className="space-y-6">
                {/* Cronジョブ一覧 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cronジョブ実行状況</CardTitle>
                    <CardDescription>
                      定期実行タスクの現在の状態
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {systemHealth.cronJobs.map(job => (
                        <div key={job.id} className="p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium">{job.name}</h3>
                            <Badge variant={
                              job.status === 'completed' ? 'default' :
                              job.status === 'running' ? 'secondary' :
                              'outline'
                            }>
                              {job.status === 'completed' ? '完了' :
                               job.status === 'running' ? '実行中' :
                               job.status === 'pending' ? '待機中' : '失敗'}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">スケジュール:</span>
                              <span className="font-medium">{job.schedule}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">成功率:</span>
                              <span className="font-medium">{job.successRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">最終実行:</span>
                              <span className="font-medium">
                                {new Date(job.lastRun).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* コスト分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle>コスト分析</CardTitle>
                    <CardDescription>
                      モデル使用比率とコスト推移
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">モデル使用比率</h3>
                        <div className="space-y-3">
                          {systemHealth.modelUsage.map(model => (
                            <div key={model.model} className="flex items-center justify-between">
                              <span className="text-sm">{model.model}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${model.usage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {model.usage}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3">コスト概要</h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">日次コスト</p>
                            <p className="text-2xl font-bold">
                              ${systemHealth.costAnalysis.dailyCost.toFixed(3)}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">月間推定コスト</p>
                            <p className="text-2xl font-bold">
                              ${systemHealth.costAnalysis.monthlyEstimate.toFixed(2)}
                            </p>
                          </div>
                          {systemHealth.costAnalysis.recommendations.length > 0 && (
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-sm font-medium text-yellow-800 mb-1">最適化提案:</p>
                              <ul className="text-xs text-yellow-700 space-y-1">
                                {systemHealth.costAnalysis.recommendations.map((rec, idx) => (
                                  <li key={idx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600 text-center">
                    システム健全性データを読み込めませんでした
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </main>

        {/* フッター */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-700 font-medium">PengPeng Daily Report 2.0</p>
              <p className="text-gray-500 text-sm mt-1">
                Active Goals進捗ダッシュボード • {today}
              </p>
            </div>
            <div className="text-gray-500 text-sm text-center md:text-right">
              <p>PengPeng Autonomous AI Agent • OpenClaw v2026.2.23</p>
              <p className="mt-1">最終更新: {lastUpdated} • 次回更新: 5分後</p>
            </div>
          </div>
          {dashboardData.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">エラー: {dashboardData.error}</p>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}