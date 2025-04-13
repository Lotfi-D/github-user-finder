import './UserCard.css';
import { GithubUser } from '../../types/githubusers.types';

type UserCardProps = {
  userInfo: GithubUser;
};

function UserCard({ userInfo }: UserCardProps) {
  return (
    <div className="user-card">
      <input type="checkbox" className="user-card__checkbox" />

      <div className="user-card__avatar">
        <img src={userInfo?.avatar_url} className="avatar-img" />
      </div>

      <div className="user-card__info">
        <div className="user-card__id">{userInfo?.id}</div>
        <div className="user-card__login">{userInfo?.login}</div>
      </div>

      <button className="user-card__button">View profile</button>
    </div>
  );
}

export default UserCard
