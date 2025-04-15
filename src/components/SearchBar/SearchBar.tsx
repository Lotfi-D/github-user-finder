import { useEffect, useState } from 'react';
import './SearchBar.css'
import { HandledError } from '../../types/errors.types';
import ToggleEditMode from '../ToggleEditMode/ToggleEditMode';

type SearchbarProps = {
  errorHandled: HandledError |null;
  onDebouncedSearchChange: (debouncedSearch: string) => void;
};

function Searchbar({ errorHandled, onDebouncedSearchChange, }: SearchbarProps) {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // This useEffect debounces the search input.
  // It runs every time the `search` state changes,
  // and resets the timeout if the user types again before the delay.
  useEffect(() => { 
    if (!search.trim()) {
      setDebouncedSearch('')
      return;
    }

    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 600)

    return () => {
      clearTimeout(debounceTimer)
    }
  }, [search])

  useEffect(() => {
    onDebouncedSearchChange(debouncedSearch)
  }, [debouncedSearch, onDebouncedSearchChange])

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search GitHub users..."
        onChange={(event) => setSearch(event.target.value)}
      />
      {errorHandled && (
        <div className='error-messages'>{errorHandled.message}</div>
      )}
      <ToggleEditMode />

    </div>)
}

export default Searchbar;