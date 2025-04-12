import './UserCard.css';

type UserCardProps = {
  avatarUrl?: string;
  username?: string;
};
//CHANGER LE TYPE EN FCT DE LA DONNEE ARRIVEE

export default function UserCard({ _test }: UserCardProps) {
  return (
    <div className="user-card">
      <input type="checkbox" className="user-card__checkbox" />

      <div className="user-card__avatar">
        <img src="https://www.media.pokekalos.fr/img/pokemon/home/small/salameche.png" className="avatar-img" />
      </div>

      <div className="user-card__info">
        <div className="user-card__id">ID</div>
        <div className="user-card__login">Login</div>
      </div>

      <button className="user-card__button">View profile</button>
    </div>
  );
}
