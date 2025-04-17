import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import Searchbar from './SearchBar';
import EditModeProvider from '../../providers/editMode/EditModeProvider';
import { HandledError } from '../../types/errors.types';

describe('Tests on searchbar Component', () => {
  it('tests if the input value changes when the user typed into', () => {

    render(
      <EditModeProvider>
        <Searchbar errorHandled={null} onDebouncedSearchChange={vi.fn()} />
      </EditModeProvider>
    );

    const input = screen.getByPlaceholderText(/search github users/i);
    
    fireEvent.change(input, { target: { value: 'monkey d. luffy' } });
    
    expect((input as HTMLInputElement).value).toBe('monkey d. luffy');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onDebouncedSearchChange to check if the debounced value is the same as the search value in the input after 600ms', async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();

    render(
      <EditModeProvider>
        <Searchbar errorHandled={null} onDebouncedSearchChange={mockFn} />
      </EditModeProvider>
    );

    const input = screen.getByPlaceholderText(/search github users/i);
    fireEvent.change(input, { target: { value: 'zidane' } });

    await act(() => vi.advanceTimersByTimeAsync(600));

    expect(mockFn).toHaveBeenCalledWith('zidane');
  });

  it('displays the error message when errorHandled is provided', () => {
    const error: HandledError = { 
      message: 'An unknown error occurred. Please try again later.',
      type: 'unknown',
    };

    render(
      <EditModeProvider>
        <Searchbar errorHandled={error} onDebouncedSearchChange={() => {}} />
      </EditModeProvider>
    );

    const errorMessage = 'An unknown error occurred. Please try again later.';
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
