import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { vi } from 'vitest';
import GithubService from '../../services/github.service';
import { GithubUser } from '../../types/githubusers.types';

vi.mock('../../providers/editMode/UseEditMode', () => ({
  default: () => ({ isEditModeActive: true }),
}));

vi.mock('../../services/github.service');

describe('Tests on HomePage', () => {
  const baseMockUsers: GithubUser[] = [
    {
      login: "user",
      id: 14959,
      node_id: "MDQ6VXNlcjE0OTU5",
      avatar_url: "https://avatars.githubusercontent.com/u/14959?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/user",
      html_url: "https://github.com/user",
      followers_url: "https://api.github.com/users/user/followers",
      following_url: "https://api.github.com/users/user/following{/other_user}",
      gists_url: "https://api.github.com/users/user/gists{/gist_id}",
      starred_url: "https://api.github.com/users/user/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/user/subscriptions",
      organizations_url: "https://api.github.com/users/user/orgs",
      repos_url: "https://api.github.com/users/user/repos",
      events_url: "https://api.github.com/users/user/events{/privacy}",
      received_events_url: "https://api.github.com/users/user/received_events",
      type: "User",
      site_admin: false,
      score: 1.0,
      user_view_type: "public",
      id_app: 14959
    },
    {
      login: "userquin",
      id: 6311119,
      node_id: "MDQ6VXNlcjYzMTExMTk=",
      avatar_url: "https://avatars.githubusercontent.com/u/6311119?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/userquin",
      html_url: "https://github.com/userquin",
      followers_url: "https://api.github.com/users/userquin/followers",
      following_url: "https://api.github.com/users/userquin/following{/other_user}",
      gists_url: "https://api.github.com/users/userquin/gists{/gist_id}",
      starred_url: "https://api.github.com/users/userquin/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/userquin/subscriptions",
      organizations_url: "https://api.github.com/users/userquin/orgs",
      repos_url: "https://api.github.com/users/userquin/repos",
      events_url: "https://api.github.com/users/userquin/events{/privacy}",
      received_events_url: "https://api.github.com/users/userquin/received_events",
      type: "User",
      site_admin: false,
      score: 1.0,
      user_view_type: "public",
      id_app: 6311119
    },
    {
      login: "user3",
      id: 3,
      node_id: "MDQ6VXNlcjM=",
      avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/user3",
      html_url: "https://github.com/user3",
      followers_url: "https://api.github.com/users/user3/followers",
      following_url: "https://api.github.com/users/user3/following{/other_user}",
      gists_url: "https://api.github.com/users/user3/gists{/gist_id}",
      starred_url: "https://api.github.com/users/user3/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/user3/subscriptions",
      organizations_url: "https://api.github.com/users/user3/orgs",
      repos_url: "https://api.github.com/users/user3/repos",
      events_url: "https://api.github.com/users/user3/events{/privacy}",
      received_events_url: "https://api.github.com/users/user3/received_events",
      type: "User",
      site_admin: false,
      score: 1,
      user_view_type: "public",
      id_app: 3,
    }
  ];

  let mockUsers: GithubUser[] = [];

  const getMockUsers = (): GithubUser[] =>
    baseMockUsers.map(user => ({ ...user }));

  beforeEach(() => {
    mockUsers = getMockUsers();
  });

  it('calls API and displays users on success', async () => {
    (GithubService.searchUsers as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockUsers }),
    });

    render(<HomePage />);

    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'user' } });

    await waitFor(() => {
      expect(GithubService.searchUsers).toHaveBeenCalledWith('user');
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('userquin')).toBeInTheDocument();
    });
  });

  it('displays "No results found" when API returns an empty response', async () => {
    (GithubService.searchUsers as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    render(<HomePage />);

    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'testdsdsqdsqdsqd' } });

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });


  it('does not call API if debounced search is empty', async () => {
    const searchSpy = vi.spyOn(GithubService, 'searchUsers');
  
    render(<HomePage />);
  
    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: '        ' } })
  
    await waitFor(() => {
      expect(searchSpy).not.toHaveBeenCalled();
    });
  });


  it('selects all users and removes them from the list', async () => {
    (GithubService.searchUsers as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockUsers }),
    });
  
    render(<HomePage />);
  
    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'user' } });
  
    await waitFor(() => {
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('userquin')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
    });
  
    const checkboxAllSelection = screen.getByLabelText(/selected all users/);
    fireEvent.click(checkboxAllSelection);
  
    const deleteButton = screen.getByLabelText(/delete selected users/i);
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(screen.queryByText('user')).not.toBeInTheDocument();
      expect(screen.queryByText('userquin')).not.toBeInTheDocument();
      expect(screen.queryByText('user3')).not.toBeInTheDocument();
    });
  });

  it('selects only one user and removes him from the list', async () => {
    (GithubService.searchUsers as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockUsers }),
    });
  
    render(<HomePage />);
  
    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'user' } });
  
    await waitFor(() => {
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('userquin')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
    });
  
    const checkboxUser = screen.getByLabelText('card-checkbox-id-6311119');
    fireEvent.click(checkboxUser);
  
    const deleteButton = screen.getByLabelText(/delete selected users/i);
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(screen.queryByText('userquin')).not.toBeInTheDocument();
      expect(screen.queryByText('user')).toBeInTheDocument();
      expect(screen.queryByText('user3')).toBeInTheDocument();
    });
  });

  it('selects only one user and duplicates him from the list', async () => {
    (GithubService.searchUsers as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockUsers }),
    });
  
    render(<HomePage />);
  
    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'user' } });
  
    await waitFor(() => {
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('userquin')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
    });
  
    const checkboxUser = screen.getByLabelText('card-checkbox-id-6311119');
    fireEvent.click(checkboxUser);
  
    const duplicateButton = screen.getByLabelText(/duplicate users/i);
    fireEvent.click(duplicateButton);
  
    await waitFor(() => {
      const duplicatedUser = screen.getAllByText('userquin');
      expect(duplicatedUser.length).toBe(2);
    });
  });
});
