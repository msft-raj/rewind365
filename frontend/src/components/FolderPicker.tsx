import React, { useState, useEffect } from 'react';
import { OutlookFolder } from '../services/api';

interface FolderPickerProps {
  folders: OutlookFolder[];
  selectedFolders: string[];
  onSelectionChange: (selectedFolderIds: string[]) => void;
}

const FolderPicker: React.FC<FolderPickerProps> = ({
  folders,
  selectedFolders,
  onSelectionChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Update selectAll state based on current selection
    setSelectAll(selectedFolders.length === folders.length);
  }, [selectedFolders, folders]);

  const handleFolderToggle = (folderId: string) => {
    const newSelection = selectedFolders.includes(folderId)
      ? selectedFolders.filter(id => id !== folderId)
      : [...selectedFolders, folderId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(folders.map(folder => folder.id));
    }
    setSelectAll(!selectAll);
  };

  // Group folders by parent folder
  const foldersByParent = folders.reduce((groups, folder) => {
    const parentName = folder.parentFolderName || 'Main Folders';
    if (!groups[parentName]) {
      groups[parentName] = [];
    }
    groups[parentName].push(folder);
    return groups;
  }, {} as Record<string, OutlookFolder[]>);

  return (
    <div className="form-group">
      <label className="form-label">Select Outlook Folders to Monitor</label>
      <div className="checkbox-item">
        <input
          type="checkbox"
          id="select-all-folders"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <label htmlFor="select-all-folders">
          <strong>Select All Folders</strong>
        </label>
      </div>
      
      <div className="checkbox-list">
        {Object.entries(foldersByParent).map(([parentName, parentFolders]) => (
          <div key={parentName}>
            {parentName !== 'Main Folders' && (
              <div style={{ fontWeight: 'bold', margin: '12px 0 8px 0', color: '#6264a7' }}>
                {parentName}
              </div>
            )}
            {parentFolders.map((folder) => (
              <div key={folder.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`folder-${folder.id}`}
                  checked={selectedFolders.includes(folder.id)}
                  onChange={() => handleFolderToggle(folder.id)}
                />
                <label htmlFor={`folder-${folder.id}`}>
                  <span className="channel-name">{folder.name}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {selectedFolders.length > 0 && (
        <p style={{ marginTop: '12px', color: '#605e5c', fontSize: '14px' }}>
          {selectedFolders.length} folder{selectedFolders.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default FolderPicker;