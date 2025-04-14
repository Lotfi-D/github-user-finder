import { useCallback, useEffect, useRef, useState } from 'react';
import './HomePage.css';
import UserCard from '../../components/UserCard/UserCard';
import GithubService from '../../services/github.service';
import DuplicateIcon from '../../components/icones/DuplicateIcon';
import TrashIcon from '../../components/icones/TrashIcon';
import Loader from '../../components/Loader/Loader';
import { GithubSearchResponse, GithubUser } from '../../types/githubusers.types';
import { HandledError } from '../../types/errors.types';
import { handleErrorMessages } from '../../helpers/ErrorHandler';

function HomePage() {
  const [usersInfos, setUsersInfos] = useState<GithubUser[]>([]);
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [errorHandled, setErrorHandled] = useState<HandledError | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const selectAllRef = useRef<HTMLInputElement>(null);


  const handleLaunchSearchUser = useCallback (async () => {
    let isErrorHandled = false;

    try {
      setIsLoading(true)
      const response = await GithubService.searchUsers(debouncedSearch);
      const json = await response.json() as GithubSearchResponse;

      if (!response.ok) {
        isErrorHandled = true
        setErrorHandled(handleErrorMessages(response, json));

        throw new Error(json.message);
      }

      json.items.forEach((user) => {
        user.id_app = user.id
      })

      setUsersInfos(json.items);
    } catch (error) {
      console.error('Error while searching GitHub users:', error);
      if (!isErrorHandled) {
        setErrorHandled(handleErrorMessages());
      }
    } finally {

      // setTimeout(() => {
      //   setIsLoading(false)
      // }, 3000)
    }
  }, [debouncedSearch])                  

  const handleSelectedUsers = (user: GithubUser, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, user.id_app] : prev.filter((idApp) => idApp !== user.id_app)
    );
  }

  const handleSelectedAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.checked) {
      setSelectedUsers(usersInfos.map((user) => user.id_app));
    } else {
      setSelectedUsers([]);
    }
  }

  const duplicateUsers = () => {
    const usersToDuplicate = selectedUsers
      .map((idSelectedUser) => usersInfos
      .find((user) => user.id === idSelectedUser))

    usersToDuplicate?.forEach((user: GithubUser | undefined) => {
      if (user) {
        const duplicatedUser = { ...user, id_app: generateIdApp(user.id) }
        setUsersInfos((prev) => [...prev, duplicatedUser])
      }
    })

    setSelectedUsers([])
  }

  const generateIdApp= (userId: number) => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return Number(`${userId}${randomNumber}`)
  }

  const deleteUsers = () => {
    const updatedUsers = usersInfos.filter((user) => !selectedUsers.includes(user.id_app));
  
    setUsersInfos(updatedUsers);
    setSelectedUsers([])
  };

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
    }, 600)

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
      console.log('ici')
      setUsersInfos([]);
      return;
    }

    handleLaunchSearchUser();
  }, [debouncedSearch, handleLaunchSearchUser]);

  return (
    <main className="main-content">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          onChange={(event) => setSearch(event.target.value)}
        />
        {errorHandled && (
          <div className='error-messages'>{errorHandled.message}</div>
        )}
      </div>

      <div className="select-all">
        <label>
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={(selectedUsers.length === usersInfos.length) && (usersInfos.length > 0) }
            disabled={usersInfos.length === 0}
            onChange={(event) => {handleSelectedAllUsers(event)}}
          />
          <span className="text-select-all-checkbox">{selectedUsers.length} elements selected</span>
        </label>
        <div className="button-actions-container">
          <button className="button-actions" disabled={selectedUsers.length === 0} onClick={duplicateUsers}>
            <DuplicateIcon />
          </button>
          <button className="button-actions" disabled={selectedUsers.length === 0} onClick={deleteUsers}>
            <TrashIcon />
          </button>
        </div>
      </div>

      {debouncedSearch && usersInfos.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <div>
          <div className="user-cards-container">
            {usersInfos.map((user, id_app) => (
              <div key={id_app}>
                <UserCard
                  userInfo={user}
                  isChecked={selectedUsers.includes(user.id_app)}
                  onCheckChange={(checked) => { handleSelectedUsers(user, checked) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default HomePage;
