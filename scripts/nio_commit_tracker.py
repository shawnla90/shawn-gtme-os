#!/usr/bin/env python3
"""
Nio's Real-Time Commit Tracker
Tracks actual GitHub commits, calculates real metrics, updates Mission Control
"""

import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

def get_recent_commits(repo_path, hours=24):
    """Get commits from the last N hours"""
    since = datetime.now() - timedelta(hours=hours)
    since_str = since.strftime('%Y-%m-%d %H:%M:%S')
    
    cmd = [
        'git', '-C', repo_path, 'log',
        '--since', since_str,
        '--pretty=format:%H|%an|%ae|%at|%s',
        '--shortstat'
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return parse_commits(result.stdout)
    except subprocess.CalledProcessError:
        return []

def parse_commits(log_output):
    """Parse git log output into structured data"""
    commits = []
    lines = log_output.strip().split('\n')
    
    i = 0
    while i < len(lines):
        if '|' in lines[i]:
            parts = lines[i].split('|')
            commit = {
                'hash': parts[0],
                'author': parts[1],
                'email': parts[2],
                'timestamp': int(parts[3]),
                'message': parts[4],
                'stats': {}
            }
            
            # Next line should be stats
            if i + 1 < len(lines) and 'changed' in lines[i + 1]:
                stats_line = lines[i + 1].strip()
                # Parse: "X files changed, Y insertions(+), Z deletions(-)"
                if 'changed' in stats_line:
                    parts = stats_line.split(',')
                    for part in parts:
                        if 'file' in part:
                            commit['stats']['files'] = int(part.split()[0])
                        elif 'insertion' in part:
                            commit['stats']['insertions'] = int(part.split()[0])
                        elif 'deletion' in part:
                            commit['stats']['deletions'] = int(part.split()[0])
                i += 2
            else:
                i += 1
                
            commits.append(commit)
        else:
            i += 1
    
    return commits

def calculate_nio_score(commits):
    """Calculate Nio's productivity score based on real commits"""
    total_commits = len(commits)
    total_insertions = sum(c.get('stats', {}).get('insertions', 0) for c in commits)
    total_deletions = sum(c.get('stats', {}).get('deletions', 0) for c in commits)
    total_files = sum(c.get('stats', {}).get('files', 0) for c in commits)
    
    # Scoring algorithm
    base_score = total_commits * 10  # 10 points per commit
    code_score = (total_insertions + total_deletions) // 10  # 1 point per 10 lines
    file_score = total_files * 2  # 2 points per file touched
    
    total_score = base_score + code_score + file_score
    
    # Determine grade
    if total_score >= 500:
        grade = 'S'
    elif total_score >= 300:
        grade = 'A'
    elif total_score >= 200:
        grade = 'B'
    elif total_score >= 100:
        grade = 'C'
    else:
        grade = 'D'
    
    return {
        'total_commits': total_commits,
        'total_insertions': total_insertions,
        'total_deletions': total_deletions,
        'total_files': total_files,
        'score': total_score,
        'grade': grade
    }

def update_mission_control_data(stats, commits):
    """Update Mission Control with real data"""
    data = {
        'last_update': datetime.now().isoformat(),
        'daily_stats': stats,
        'recent_commits': [
            {
                'message': c['message'][:80],
                'time': datetime.fromtimestamp(c['timestamp']).strftime('%I:%M %p')
            } for c in commits[:5]  # Last 5 commits
        ],
        'features_shipped': extract_features(commits),
        'nio_status': {
            'current_task': 'System Enhancement',
            'mood': 'accomplished' if stats['grade'] in ['S', 'A'] else 'focused',
            'energy': min(100, stats['score'] // 3)  # Energy based on score
        }
    }
    
    # Save to file for Mission Control to read
    output_path = Path('/tmp/nio_mission_control_data.json')
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    return data

def extract_features(commits):
    """Extract feature names from commit messages"""
    features = []
    feature_keywords = ['feat:', 'add:', 'implement:', 'create:', 'build:']
    
    for commit in commits:
        msg = commit['message'].lower()
        for keyword in feature_keywords:
            if keyword in msg:
                feature = commit['message'].split(keyword)[1].split('\n')[0].strip()
                if feature:
                    features.append(feature[:50])  # Truncate long features
                break
    
    return features[:10]  # Top 10 features

def main():
    """Main tracking function"""
    repo_path = '/Users/shawnos.ai/shawn-gtme-os'
    
    # Get commits from last 24 hours
    commits = get_recent_commits(repo_path, 24)
    
    # Calculate stats
    stats = calculate_nio_score(commits)
    
    # Update Mission Control
    data = update_mission_control_data(stats, commits)
    
    # Print summary
    print(f"🚀 NIO COMMIT TRACKER - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"📊 Last 24h: {stats['total_commits']} commits, {stats['total_insertions']}+ {stats['total_deletions']}-")
    print(f"🎯 Score: {stats['score']} (Grade: {stats['grade']})")
    print(f"✨ Features: {len(data['features_shipped'])} shipped")
    
    return data

if __name__ == '__main__':
    main()