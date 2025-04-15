import { useEffect, useRef } from 'react';
import DuplicateIcon from '../icones/DuplicateIcon';
import TrashIcon from '../icones/TrashIcon';
import './UserSelectionActions.css'

type UserSelectionActionsProps = {
  selectedUsersLength: number;
  usersLength: number;
  onSelectedUsers: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDuplicateUsers: () => void;
  onDeleteUsers: () => void;
}


function UserSelectionActions({ selectedUsersLength, usersLength, onSelectedUsers, onDuplicateUsers, onDeleteUsers }: UserSelectionActionsProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectAllRef.current) return;
  
    selectAllRef.current.indeterminate = selectedUsersLength > 0 && selectedUsersLength < usersLength;
  }, [selectedUsersLength, usersLength]);

  return (
    <div className="select-all">
      <label>
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={(selectedUsersLength === usersLength) && (usersLength > 0) }
          disabled={usersLength === 0}
          onChange={onSelectedUsers}
        />
        <span className="text-select-all-checkbox">{selectedUsersLength} elements selected</span>
      </label>
      <div className="button-actions-container">
        <button 
          className="button-actions"
          disabled={selectedUsersLength === 0}
          onClick={onDuplicateUsers}
        >
          <DuplicateIcon />
        </button>
        <button 
          className="button-actions"
          disabled={selectedUsersLength === 0}
          onClick={onDeleteUsers}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

export default UserSelectionActions;
