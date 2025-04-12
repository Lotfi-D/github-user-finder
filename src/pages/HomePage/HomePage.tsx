import UserCard from '../../components/UserCard/UserCard';
import './HomePage.css';

function Home() {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
        />
      </div>
      <UserCard />
    </>
  );
}

export default Home
