import './UserCard.css';
import { GithubUser } from '../../types/githubusers.types';

type UserCardProps = {
  userInfo: GithubUser;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
};

function UserCard({ userInfo, isChecked, onCheckChange }: UserCardProps) {
  return (
    <div className="user-card">
     <input
      type="checkbox"
      aria-label={`card-checkbox-id-${userInfo.id}`}
      className="user-card__checkbox"
      checked={isChecked}
      onChange={(event) => onCheckChange(event.target.checked)}
    />

      <div className="user-card__avatar">
        <img src={userInfo?.avatar_url} className="avatar-img" />
      </div>

      <div className="user-card__info">
        <div className="user-card__id">{userInfo?.id}</div>
        <div className="user-card__login" title={userInfo?.login}>{userInfo?.login}</div>
      </div>

      <button className="user-card__button">View profile</button>
    </div>
  );
}

export default UserCard;
