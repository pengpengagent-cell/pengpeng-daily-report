import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'pengpengagent-cell';
const REPO_NAME = 'workspace-backup';

export async function GET(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GITHUB_TOKEN環境変数が設定されていません' },
        { status: 500 }
      );
    }

    // 直近30日間のコミット履歴を取得
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);
    const since = sinceDate.toISOString();

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?since=${since}&per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'PengPeng-Dashboard'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub APIエラー:', response.status, errorText);
      return NextResponse.json(
        { error: `GitHub APIエラー: ${response.status}` },
        { status: response.status }
      );
    }

    const commits = await response.json();
    
    // コミットデータを整形
    const formattedCommits = commits.map((commit: any) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0], // 最初の行のみ
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }));

    // 統計情報を計算
    const stats = {
      totalCommits: formattedCommits.length,
      commitsByDay: calculateCommitsByDay(formattedCommits),
      lastCommit: formattedCommits[0] || null,
      streakDays: calculateStreakDays(formattedCommits),
      averageCommitsPerDay: calculateAverageCommits(formattedCommits)
    };

    return NextResponse.json({
      success: true,
      stats,
      commits: formattedCommits.slice(0, 20) // 直近20件のみ返す
    });

  } catch (error) {
    console.error('GitHubコミット取得エラー:', error);
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    );
  }
}

// 日別コミット数を計算
function calculateCommitsByDay(commits: any[]) {
  const commitsByDay: Record<string, number> = {};
  
  commits.forEach(commit => {
    const date = new Date(commit.date).toISOString().split('T')[0];
    commitsByDay[date] = (commitsByDay[date] || 0) + 1;
  });

  return Object.entries(commitsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// 連続コミット日数を計算
function calculateStreakDays(commits: any[]) {
  if (commits.length === 0) return 0;
  
  const commitDates = new Set(
    commits.map(commit => new Date(commit.date).toISOString().split('T')[0])
  );
  
  const dates = Array.from(commitDates).sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  
  // 今日から過去に向かって連続日数を計算
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streak++;
    } else if (streak > 0) {
      break; // 連続が途切れた
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

// 1日あたりの平均コミット数を計算
function calculateAverageCommits(commits: any[]) {
  if (commits.length === 0) return 0;
  
  const commitDates = new Set(
    commits.map(commit => new Date(commit.date).toISOString().split('T')[0])
  );
  
  const totalDays = commitDates.size;
  return totalDays > 0 ? commits.length / totalDays : 0;
}