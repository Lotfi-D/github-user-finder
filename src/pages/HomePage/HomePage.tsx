import { useCallback, useEffect, useRef, useState } from 'react';
import './HomePage.css';
import UserCard from '../../components/UserCard/UserCard';
import GithubService from '../../services/github.service';
import { GithubSearchResponse, GithubUser } from '../../types/githubusers.types';
import { HandledError } from '../../types/errors.types';
import { handleErrorMessages } from '../../helpers/ErrorHandler';
import DuplicateIcon from '../../components/icones/DuplicateIcon';
import TrashIcon from '../../components/icones/TrashIcon';

function HomePage() {
  const [usersInfos, setUsersInfos] = useState<GithubUser[]>([]);
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [errorHandled, setErrorHandled] = useState<HandledError | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  const selectAllRef = useRef<HTMLInputElement>(null);


  const handleLaunchSearchUser = useCallback (async () => {
    let isErrorHandled = false;

    try {
      const response = await GithubService.searchUsers(debouncedSearch);
      const json = await response.json() as GithubSearchResponse;

      if (!response.ok) {
        isErrorHandled = true
        setErrorHandled(handleErrorMessages(response, json));

        throw new Error(json.message);
      }

      setUsersInfos(json.items);
    } catch (error) {
      console.error('Error while searching GitHub users:', error);
      if (!isErrorHandled) {
        setErrorHandled(handleErrorMessages());
      }
    }
  }, [debouncedSearch])                  

  const handleSelectedUsers = (user: GithubUser, checked: boolean) => {
    console.log('handle chdeck')
    setSelectedUsers((prev) =>
      checked ? [...prev, user.id] : prev.filter((id) => id !== user.id)
    );
  }

  useEffect(() => {
    if (!selectAllRef.current) return;
  
    selectAllRef.current.indeterminate = selectedUsers.length > 0 && selectedUsers.length < usersInfos.length;
  }, [selectedUsers, usersInfos]);


  // This useEffect debounces the search input.
  // It runs every time the `search` state changes,
  // and resets the timeout if the user types again before the delay.
  useEffect(() => {
    setErrorHandled(null);

    if (!search.trim()) {
      setDebouncedSearch('')
      return;
    }

    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 0)

    return () => {
      clearTimeout(debounceTimer)
    }
  }, [search])

  // This useEffect is triggered every time `debouncedSearch` changes.
  // `handleLaunchSearchUser` is added to the dependencies to satisfy ESLint rules.
  // The function is memoized with `useCallback` to prevent infinite loops (line 13).
  // As a result, the effect is only re-triggered when `debouncedSearch` actually changes.
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      return;
    }

    handleLaunchSearchUser();
  }, [debouncedSearch, handleLaunchSearchUser]);

  const selectAllCheckbox = usersInfos.length > 0 ? (
    <div className="select-all">
      <label>
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={selectedUsers.length === usersInfos.length}
          onChange={(event) => {
            console.log('selectAllRef', selectAllRef)
            if (event.target.checked) {
              setSelectedUsers(usersInfos.map((user) => user.id));
            } else {
              setSelectedUsers([]);
            }
          }}
        />
        <span className="text-select-all-checkbox">{selectedUsers.length} elements selected</span>
      </label>
      <div className="button-actions">
        <button>
          <DuplicateIcon />
        </button>
        <button>
          <TrashIcon />
        </button>
        
      </div>
    </div>
  ) : null;

  return (
    <main className="main-content">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {errorHandled && (
          <div className='error-messages'>{errorHandled.message}</div>
        )}
      </div>
      {debouncedSearch && usersInfos.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <div>
          {selectAllCheckbox}
          <div className="user-cards-container">
            {usersInfos.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                isChecked={selectedUsers.includes(user.id)}
                onCheckChange={(checked) => {handleSelectedUsers(user, checked)}}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default HomePage;
