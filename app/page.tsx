import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ダミーのcronジョブデータ
const cronJobs = [
  { id: 1, name: 'Learning Session', schedule: '毎4時間', status: 'running', lastRun: '2026-02-24 03:00 UTC', channel: '#learning' },
  { id: 2, name: 'AI News Daily', schedule: '21:00 SGT', status: 'completed', lastRun: '2026-02-23 21:00 SGT', channel: '#ai-news' },
  { id: 3, name: 'OpenClaw Monitor', schedule: '21:20 SGT', status: 'completed', lastRun: '2026-02-23 21:20 SGT', channel: '#ai-news' },
  { id: 4, name: 'Workspace Backup', schedule: '23:00 SGT', status: 'running', lastRun: '2026-02-23 23:00 SGT', channel: '#ai-news' },
  { id: 5, name: 'Morning Report', schedule: '06:00 SGT', status: 'pending', lastRun: '2026-02-24 06:00 SGT', channel: '#general' },
];

export default function Home() {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'running': return '実行中';
      case 'pending': return '待機中';
      case 'failed': return '失敗';
      default: return '不明';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">PengPeng Daily Report</h1>
          <p className="text-gray-600 mt-2">OpenClaw Cronジョブ実行状況ダッシュボード</p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">今日の日付: {today}</h2>
                <p className="text-gray-600 text-sm mt-1">最終更新: {new Date().toLocaleTimeString('ja-JP')}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant="outline" className="text-sm">
                  稼働中: {cronJobs.filter(job => job.status === 'running' || job.status === 'completed').length} / {cronJobs.length}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cronJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.name}</CardTitle>
                      <CardDescription className="mt-1">{job.schedule}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">最終実行</p>
                      <p className="font-medium">{job.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">報告チャンネル</p>
                      <p className="font-medium">{job.channel}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">ジョブID</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{job.id}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* サマリーカード */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>システムサマリー</CardTitle>
              <CardDescription>PengPeng OpenClawシステムの現在の状態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">正常稼働ジョブ</p>
                  <p className="text-2xl font-bold text-green-700">
                    {cronJobs.filter(job => job.status === 'completed' || job.status === 'running').length}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">本日実行予定</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {cronJobs.filter(job => job.status === 'pending').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">総監視ジョブ</p>
                  <p className="text-2xl font-bold text-gray-700">{cronJobs.length}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">注記:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• このダッシュボードはPengPengのcronジョブ実行状況を表示します</li>
                  <li>• データは定期的に更新されます（次回更新: 1時間後）</li>
                  <li>• 問題が発生した場合は#devチャンネルに報告されます</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* フッター */}
        <footer className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
          <p>PengPeng Autonomous AI Agent • OpenClaw v2026.2.21 • {new Date().getFullYear()}</p>
          <p className="mt-1">このダッシュボードはNext.js + TypeScriptで構築されています</p>
        </footer>
      </div>
    </div>
  );
}