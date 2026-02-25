import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GoalProgress } from '@/types/dashboard';

interface GoalProgressCardProps {
  goal: GoalProgress;
  title: string;
  description: string;
  goalNumber: 'G1' | 'G2' | 'G3';
  className?: string;
}

export function GoalProgressCard({ 
  goal, 
  title, 
  description, 
  goalNumber,
  className 
}: GoalProgressCardProps) {
  const progressPercentage = Math.round((goal.current / goal.target) * 100);
  
  const getStatusColor = (status: GoalProgress['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'near-complete': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: GoalProgress['status']) => {
    switch (status) {
      case 'completed': return '完了';
      case 'near-complete': return 'ほぼ完了';
      case 'in-progress': return '進行中';
      case 'not-started': return '未開始';
      default: return '不明';
    }
  };

  const getGoalColor = (goalNumber: string) => {
    switch (goalNumber) {
      case 'G1': return 'border-l-4 border-l-purple-500';
      case 'G2': return 'border-l-4 border-l-blue-500';
      case 'G3': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <Card className={`${className} ${getGoalColor(goalNumber)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono">
                {goalNumber}
              </Badge>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge className={getStatusColor(goal.status)}>
            {getStatusText(goal.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 進捗バー */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">進捗: {goal.current}/{goal.target}</span>
              <span className="text-gray-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* メトリクス */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">監視メトリクス:</p>
            <div className="flex flex-wrap gap-2">
              {goal.metrics.map((metric, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>

          {/* 最終更新 */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              最終改善: {goal.lastImprovement}
            </p>
          </div>

          {/* 推奨アクション（進捗が低い場合） */}
          {progressPercentage < 70 && (
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 mb-1">推奨アクション:</p>
              <p className="text-xs text-yellow-700">
                進捗が目標に達していません。優先度を上げて取り組むことを検討してください。
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}