// UserCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserCard from './UserCard';
import { vi } from 'vitest';
import { GithubUser } from '../../types/githubusers.types';

describe('Tests on UserCard Component', () => {
  const mockUser: GithubUser = {
    login: 'john_doe',
    id: 12345,
    node_id: 'MDQ6VXNlcjEyMzQ1',
    avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/john_doe',
    html_url: 'https://github.com/john_doe',
    followers_url: 'https://api.github.com/users/john_doe/followers',
    following_url: 'https://api.github.com/users/john_doe/following{/other_user}',
    gists_url: 'https://api.github.com/users/john_doe/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/john_doe/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/john_doe/subscriptions',
    organizations_url: 'https://api.github.com/users/john_doe/orgs',
    repos_url: 'https://api.github.com/users/john_doe/repos',
    events_url: 'https://api.github.com/users/john_doe/events{/privacy}',
    received_events_url: 'https://api.github.com/users/john_doe/received_events',
    type: 'User',
    site_admin: false,
    score: 100,
    user_view_type: 'public',
    id_app: 0
  };

  it('calls onCheckChange when checkbox is clicked', () => {
    let checked = false;
    
    const mockOnCheckChange = vi.fn((newChecked) => {
      checked = newChecked;
      rerender(<UserCard userInfo={mockUser} isChecked={checked} onCheckChange={mockOnCheckChange} />);
    });

    const { rerender } = render(
      <UserCard userInfo={mockUser} isChecked={checked} onCheckChange={mockOnCheckChange} />
    );

    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    expect(mockOnCheckChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(mockOnCheckChange).toHaveBeenCalledWith(false);
  });
});
