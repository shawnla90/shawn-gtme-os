#!/usr/bin/env python3
"""
Mission Control Enhanced Data Updater
Tracks calendar, todos, drafts, and real-time metrics
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
import os

def get_draft_status():
    """Check for drafts in various content directories"""
    drafts = []
    
    # Check Substack drafts
    substack_path = Path('/Users/shawnos.ai/shawn-gtme-os/content/substack/drafts')
    if substack_path.exists():
        for draft in substack_path.glob('*.md'):
            drafts.append({
                'type': 'substack',
                'title': draft.stem.replace('_', ' ').title(),
                'status': 'ready to ship',
                'created': datetime.fromtimestamp(draft.stat().st_mtime).strftime('%Y-%m-%d')
            })
    
    # Check LinkedIn drafts  
    linkedin_path = Path('/Users/shawnos.ai/shawn-gtme-os/content/linkedin')
    if linkedin_path.exists():
        for draft in linkedin_path.glob('*.md'):
            if 'draft' in str(draft):
                drafts.append({
                    'type': 'linkedin',
                    'title': draft.stem.replace('-', ' ').title(),
                    'status': 'needs review',
                    'created': datetime.fromtimestamp(draft.stat().st_mtime).strftime('%Y-%m-%d')
                })
    
    return drafts[:5]  # Top 5 drafts

def generate_todos():
    """Generate dynamic todo list based on system state"""
    todos = []
    tomorrow = datetime.now() + timedelta(days=1)
    
    # Core daily todos
    todos.extend([
        {
            'task': 'Review nio.terminal blog post',
            'time': '8:15 AM',
            'priority': 'high',
            'automated': True
        },
        {
            'task': 'Check Discord community engagement',
            'time': '10:00 AM',
            'priority': 'medium',
            'automated': False
        },
        {
            'task': 'Monitor RSS feed performance',
            'time': '2:00 PM',
            'priority': 'medium',
            'automated': True
        }
    ])
    
    # Add draft-related todos
    draft_count = len(get_draft_status())
    if draft_count > 0:
        todos.append({
            'task': f'Publish {draft_count} pending drafts',
            'time': 'Flexible',
            'priority': 'high',
            'automated': False
        })
    
    # Weekly todos (if Friday)
    if tomorrow.weekday() == 4:  # Friday
        todos.append({
            'task': 'Weekly system performance review',
            'time': '4:00 PM',
            'priority': 'medium',
            'automated': False
        })
    
    return todos

def generate_calendar_events():
    """Generate calendar events for next 7 days"""
    events = []
    now = datetime.now()
    
    for i in range(7):
        date = now + timedelta(days=i)
        day_events = []
        
        # Daily recurring events
        day_events.append({
            'time': '8:00 AM',
            'event': 'nio.terminal blog generation',
            'type': 'automated'
        })
        
        if date.weekday() < 5:  # Weekdays
            day_events.append({
                'time': '6:00 AM',
                'event': 'Morning briefing scan',
                'type': 'automated'
            })
        
        day_events.append({
            'time': '10:00 PM',
            'event': 'Daily build summary',
            'type': 'automated'
        })
        
        # Special events
        if date.weekday() == 0:  # Monday
            day_events.append({
                'time': '3:00 PM',
                'event': 'Weekly Discord community roundup',
                'type': 'planned'
            })
        
        events.append({
            'date': date.strftime('%Y-%m-%d'),
            'day': date.strftime('%A'),
            'events': day_events
        })
    
    return events[:3]  # Next 3 days for display

def update_mission_control_enhanced():
    """Create enhanced Mission Control data file"""
    
    # Read commit tracker data if exists
    commit_data = {}
    commit_file = Path('/tmp/nio_mission_control_data.json')
    if commit_file.exists():
        with open(commit_file) as f:
            commit_data = json.load(f)
    
    # Enhanced data structure
    enhanced_data = {
        'last_update': datetime.now().isoformat(),
        'system_status': {
            'overall': 'optimal',
            'services': {
                'website': 'operational',
                'rss_feed': 'live',
                'discord_bot': 'connected',
                'openclaw': 'active'
            }
        },
        'daily_metrics': commit_data.get('daily_stats', {
            'total_commits': 0,
            'score': 0,
            'grade': 'N/A'
        }),
        'calendar': generate_calendar_events(),
        'todos': generate_todos(),
        'drafts': get_draft_status(),
        'recent_features': commit_data.get('features_shipped', []),
        'nio_insights': {
            'observation': 'Discord integration complete. Community engagement beginning.',
            'suggestion': 'Consider creating Discord-exclusive content to drive server growth.',
            'focus': 'Automation refinement and content pipeline optimization'
        }
    }
    
    # Save enhanced data
    output_path = Path('/tmp/mission_control_enhanced.json')
    with open(output_path, 'w') as f:
        json.dump(enhanced_data, f, indent=2)
    
    print(f"✅ Mission Control data updated: {output_path}")
    return enhanced_data

if __name__ == '__main__':
    data = update_mission_control_enhanced()
    print(f"📅 Calendar: {len(data['calendar'])} days planned")
    print(f"✅ Todos: {len(data['todos'])} tasks")
    print(f"📝 Drafts: {len(data['drafts'])} ready")