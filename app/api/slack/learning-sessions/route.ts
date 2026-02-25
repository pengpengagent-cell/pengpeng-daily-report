import { NextRequest, NextResponse } from 'next/server';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const LEARNING_CHANNEL_ID = 'C0AF3CBNEJE'; // #learningチャンネル

export async function GET(request: NextRequest) {
  try {
    if (!SLACK_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'SLACK_BOT_TOKEN環境変数が設定されていません' },
        { status: 500 }
      );
    }

    // 直近7日間のメッセージを取得
    const oldest = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60); // 7日前
    
    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${LEARNING_CHANNEL_ID}&oldest=${oldest}&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Slack APIエラー:', response.status, errorText);
      return NextResponse.json(
        { error: `Slack APIエラー: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Slack APIレスポンスエラー:', data.error);
      return NextResponse.json(
        { error: `Slack APIエラー: ${data.error}` },
        { status: 500 }
      );
    }

    const messages = data.messages || [];
    
    // Learning Sessionメッセージをフィルタリング（PengPeng投稿のみ）
    const learningSessions = messages.filter((msg: any) => {
      // PengPengの投稿で、Learning Session関連のメッセージ
      const isPengPeng = msg.bot_id || msg.user === 'U0AF5TDDWFN'; // PengPengのユーザーID
      const isLearningSession = msg.text?.includes('Learning Session') || 
                               msg.text?.includes('Self-Audit') ||
                               msg.text?.includes('Action Plan');
      return isPengPeng && isLearningSession;
    });

    // メッセージデータを整形
    const formattedSessions = learningSessions.map((msg: any) => {
      const text = msg.text || '';
      const reactions = msg.reactions || [];
      
      // リアクション分析
      const reactionAnalysis = {
        total: reactions.reduce((sum: number, r: any) => sum + r.count, 0),
        byType: reactions.reduce((acc: Record<string, number>, r: any) => {
          acc[r.name] = r.count;
          return acc;
        }, {}),
        hasOwnerFeedback: reactions.some((r: any) => 
          ['+1', 'thumbsup', 'white_check_mark'].includes(r.name)
        )
      };

      // 品質スコア計算（簡易版）
      let qualityScore = 0;
      if (reactionAnalysis.hasOwnerFeedback) qualityScore += 30;
      if (reactionAnalysis.total > 0) qualityScore += Math.min(reactionAnalysis.total * 10, 40);
      if (text.length > 500) qualityScore += 30; // 内容の充実度

      return {
        id: msg.ts,
        timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
        textPreview: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        reactions: reactionAnalysis,
        qualityScore: Math.min(qualityScore, 100),
        hasSelfAudit: text.includes('Self-Audit'),
        hasActionPlan: text.includes('Action Plan'),
        url: `https://app.slack.com/client/T0AF5TDDW/C0AF3CBNEJE/thread/${msg.ts}`
      };
    });

    // 統計情報を計算
    const stats = {
      totalSessions: formattedSessions.length,
      sessionsByDay: calculateSessionsByDay(formattedSessions),
      averageQualityScore: calculateAverageQuality(formattedSessions),
      feedbackRate: calculateFeedbackRate(formattedSessions),
      lastSession: formattedSessions[0] || null
    };

    return NextResponse.json({
      success: true,
      stats,
      sessions: formattedSessions.slice(0, 10) // 直近10件のみ返す
    });

  } catch (error) {
    console.error('Slack Learning Sessions取得エラー:', error);
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    );
  }
}

// 日別セッション数を計算
function calculateSessionsByDay(sessions: any[]) {
  const sessionsByDay: Record<string, number> = {};
  
  sessions.forEach(session => {
    const date = new Date(session.timestamp).toISOString().split('T')[0];
    sessionsByDay[date] = (sessionsByDay[date] || 0) + 1;
  });

  return Object.entries(sessionsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// 平均品質スコアを計算
function calculateAverageQuality(sessions: any[]) {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, session) => sum + session.qualityScore, 0);
  return Math.round(total / sessions.length);
}

// フィードバック率を計算（Ownerからのリアクションがあるセッションの割合）
function calculateFeedbackRate(sessions: any[]) {
  if (sessions.length === 0) return 0;
  const withFeedback = sessions.filter(s => s.reactions.hasOwnerFeedback).length;
  return Math.round((withFeedback / sessions.length) * 100);
}