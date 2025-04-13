import './HomePage.css';
import { useEffect, useState } from 'react';
import UserCard from '../../components/UserCard/UserCard';
import GithubService from '../../services/github.service';
import { GithubUser } from '../../types/githubusers.types';

function HomePage() {
  const [usersInfos, setUsersInfos] = useState<GithubUser[]>([]);

  const [test, setTest] = useState<string>('')

  // This function handles the debounce for the input
  const handleInputSearch  = (event: Event) => {
    const testTimeout = setTimeout(() => {
      console.log('e', event?.target?.value)
      setTest(event?.target?.value)
    }, 2000)

    return () => {
      clearTimeout(testTimeout)
    }
  }

  const handleLaunchSearchUser = async() => {
    try {    
      const response = await GithubService.searchUsers(test);
      const json = await response.json();
  
      setUsersInfos(json.items);
      console.log('json', json)
    } catch (error) {
      console.error('Error while searching GitHub users:', error);
    }
  }

  useEffect(() => {
    console.log('test :', test);
    handleLaunchSearchUser();
  }, [test]);

  return (
    <main className="main-content">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          onChange={handleInputSearch}
        />
      </div>
      <div className="user-cards-container">
        {usersInfos?.map((user) => (
            <UserCard userInfo={user} key={user.id}/>
          )
        )}
      </div>
    </main>
  );
}

export default HomePage
