import './HomePage.css';
import { useCallback, useEffect, useState } from 'react';
import UserCard from '../../components/UserCard/UserCard';
import GithubService from '../../services/github.service';
import { GithubUser } from '../../types/githubusers.types';

function HomePage() {
  const [usersInfos, setUsersInfos] = useState<GithubUser[]>([]);
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const handleLaunchSearchUser = useCallback (async () => {
    try {    
      const response = await GithubService.searchUsers(debouncedSearch);
      const json = await response.json();
  
      setUsersInfos(json.items);
    } catch (error) {
      console.error('Error while searching GitHub users:', error);
    }
  }, [debouncedSearch])

  // This useEffect debounces the search input.
  // It runs every time the `search` state changes,
  // and resets the timeout if the user types again before the delay.
  useEffect(() => {
    if (!search.trim()) {
      setDebouncedSearch('')
      return;
    }
    
    const testTimeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 600)

    return () => {
      clearTimeout(testTimeout)
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

  return (
    <main className="main-content">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {debouncedSearch && usersInfos.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <div className="user-cards-container">
          {usersInfos.map((user) => (
            <UserCard userInfo={user} key={user.id} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage
