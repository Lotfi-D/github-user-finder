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
    </>
  );
}

export default Home
