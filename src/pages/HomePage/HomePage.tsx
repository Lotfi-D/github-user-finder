import { useCallback, useState } from 'react';
import './HomePage.css';
import UserCard from '../../components/UserCard/UserCard';
import GithubService from '../../services/github.service';
import Loader from '../../components/Loader/Loader';
import { GithubSearchResponse, GithubUser } from '../../types/githubusers.types';
import { HandledError } from '../../types/errors.types';
import { handleErrorMessages } from '../../helpers/ErrorHandler';
import Searchbar from '../../components/SearchBar/SearchBar';
import UserSelectionActions from '../../components/UserSelectionActions/UserSelectionActions';
import useEditMode from '../../providers/editMode/UseEditMode';

function HomePage() {
  const [usersInfos, setUsersInfos] = useState<GithubUser[]>([]);
  const [errorHandled, setErrorHandled] = useState<HandledError | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNoResult, setIsNoResult] = useState<boolean>(false);
  
  const { isEditModeActive } = useEditMode();
  
  const handleLaunchSearchUser = useCallback(async (debouncedSearch: string) => {
    let isErrorHandled = false;
    setErrorHandled(null);
    setIsNoResult(false);
    setUsersInfos([]);

    try {
      if (!debouncedSearch.trim()) {
            return;
      } else {
        setIsLoading(true)
        const response = await GithubService.searchUsers(debouncedSearch);
        const json = await response.json() as GithubSearchResponse;

        if (!response.ok) {
          isErrorHandled = true
          setErrorHandled(handleErrorMessages(response, json));

          throw new Error(json.message);
        }

        // we user this key to distinguish between original profiles and the duplicates one
        // it will also allow to delete the right selected users
        // because this key is unique for all users
        json.items.forEach((user) => {
          user.id_app = user.id;
        })
        
        setIsNoResult(json.items.length === 0);

        setUsersInfos(json.items);
      }
      
    } catch (error) {
      console.error('Error while searching GitHub users:', error);
      if (!isErrorHandled) {
        setErrorHandled(handleErrorMessages());
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }, [])                  

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

  // it generates id_app for duplicates users
  const generateIdApp= (userId: number) => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return Number(`${userId}${randomNumber}`)
  }

  const deleteUsers = () => {
    const updatedUsers = usersInfos.filter((user) => !selectedUsers.includes(user.id_app));
  
    setUsersInfos(updatedUsers);
    setSelectedUsers([])
  };

  return (
    <main className="main-content">
      <Searchbar errorHandled={errorHandled} onDebouncedSearchChange={handleLaunchSearchUser} />
      
      { isEditModeActive && (
          <UserSelectionActions 
            selectedUsersLength={selectedUsers?.length}
            usersLength={usersInfos.length}
            onSelectedUsers={handleSelectedAllUsers}
            onDeleteUsers={deleteUsers}
            onDuplicateUsers={duplicateUsers}
          />
        )
      }
      {isNoResult ? (
        <div className="no-results">No results found {isNoResult}</div>
      ) : (
        <div className="user-cards-wrapper">
          {isLoading && <Loader />}
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
