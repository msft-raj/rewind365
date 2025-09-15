import React, { useState, useEffect } from 'react';
import { TeamChannel } from '../services/api';

interface ChannelPickerProps {
  channels: TeamChannel[];
  selectedChannels: string[];
  onSelectionChange: (selectedChannelIds: string[]) => void;
}

const ChannelPicker: React.FC<ChannelPickerProps> = ({
  channels,
  selectedChannels,
  onSelectionChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Update selectAll state based on current selection
    setSelectAll(selectedChannels.length === channels.length);
  }, [selectedChannels, channels]);

  const handleChannelToggle = (channelId: string) => {
    const newSelection = selectedChannels.includes(channelId)
      ? selectedChannels.filter(id => id !== channelId)
      : [...selectedChannels, channelId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(channels.map(channel => channel.id));
    }
    setSelectAll(!selectAll);
  };

  // Group channels by team
  const channelsByTeam = channels.reduce((groups, channel) => {
    const teamName = channel.teamName;
    if (!groups[teamName]) {
      groups[teamName] = [];
    }
    groups[teamName].push(channel);
    return groups;
  }, {} as Record<string, TeamChannel[]>);

  return (
    <div className="form-group">
      <label className="form-label">Select Teams Channels to Monitor</label>
      <div className="checkbox-item">
        <input
          type="checkbox"
          id="select-all-channels"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <label htmlFor="select-all-channels">
          <strong>Select All Channels</strong>
        </label>
      </div>
      
      <div className="checkbox-list">
        {Object.entries(channelsByTeam).map(([teamName, teamChannels]) => (
          <div key={teamName}>
            <div style={{ fontWeight: 'bold', margin: '12px 0 8px 0', color: '#6264a7' }}>
              {teamName}
            </div>
            {teamChannels.map((channel) => (
              <div key={channel.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`channel-${channel.id}`}
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                />
                <label htmlFor={`channel-${channel.id}`}>
                  <span className="channel-name">{channel.name}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {selectedChannels.length > 0 && (
        <p style={{ marginTop: '12px', color: '#605e5c', fontSize: '14px' }}>
          {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default ChannelPicker;