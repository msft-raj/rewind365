import React from 'react';
import { DailyDigest, DigestItem } from '../services/api';

interface DigestViewProps {
  digestData: DailyDigest;
}

const DigestView: React.FC<DigestViewProps> = ({ digestData }) => {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'action': return 'Action Required';
      case 'info': return 'Information';
      default: return 'General';
    }
  };

  const groupItemsByPriority = (items: DigestItem[]) => {
    return {
      urgent: items.filter(item => item.priority === 'urgent'),
      action: items.filter(item => item.priority === 'action'),
      info: items.filter(item => item.priority === 'info'),
    };
  };

  const renderDigestItem = (item: DigestItem) => (
    <div key={item.id} className={`digest-item priority-${item.priority}`}>
      <div className="digest-item-header">
        <span className="digest-item-source">
          {item.source === 'teams' ? '👥 Teams' : '📧 Outlook'} • {item.sourceDetails}
        </span>
        <span className="digest-item-time">
          {formatTime(item.timestamp)}
        </span>
      </div>
      <div className="digest-item-title">{item.title}</div>
      <div className="digest-item-summary">{item.summary}</div>
      {item.url && (
        <div style={{ marginTop: '12px' }}>
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="button button-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            View in Teams
          </a>
        </div>
      )}
    </div>
  );

  const groupedItems = groupItemsByPriority(digestData.items);

  if (digestData.items.length === 0) {
    return (
      <div className="empty-state">
        <h3>No updates today! 🎉</h3>
        <p>You're all caught up. Check back later for new updates.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2>Today's Summary</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ color: '#d13438' }}>{digestData.summary.urgentCount}</strong>
            <span style={{ marginLeft: '8px', color: '#605e5c' }}>Urgent</span>
          </div>
          <div>
            <strong style={{ color: '#ffaa44' }}>{digestData.summary.actionCount}</strong>
            <span style={{ marginLeft: '8px', color: '#605e5c' }}>Action Required</span>
          </div>
          <div>
            <strong style={{ color: '#6264a7' }}>{digestData.summary.infoCount}</strong>
            <span style={{ marginLeft: '8px', color: '#605e5c' }}>Information</span>
          </div>
        </div>
      </div>

      {/* Urgent Items */}
      {groupedItems.urgent.length > 0 && (
        <div className="digest-section">
          <div className="digest-section-header">
            <span className="digest-section-icon">🔥</span>
            <h2 className="digest-section-title">
              {getPriorityLabel('urgent')} ({groupedItems.urgent.length})
            </h2>
          </div>
          {groupedItems.urgent.map(renderDigestItem)}
        </div>
      )}

      {/* Action Items */}
      {groupedItems.action.length > 0 && (
        <div className="digest-section">
          <div className="digest-section-header">
            <span className="digest-section-icon">✅</span>
            <h2 className="digest-section-title">
              {getPriorityLabel('action')} ({groupedItems.action.length})
            </h2>
          </div>
          {groupedItems.action.map(renderDigestItem)}
        </div>
      )}

      {/* Info Items */}
      {groupedItems.info.length > 0 && (
        <div className="digest-section">
          <div className="digest-section-header">
            <span className="digest-section-icon">💬</span>
            <h2 className="digest-section-title">
              {getPriorityLabel('info')} ({groupedItems.info.length})
            </h2>
          </div>
          {groupedItems.info.map(renderDigestItem)}
        </div>
      )}
    </div>
  );
};

export default DigestView;