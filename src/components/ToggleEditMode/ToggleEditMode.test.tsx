import { render, screen } from '@testing-library/react';
import ToggleEditMode from './ToggleEditMode';
import { vi } from 'vitest';

vi.mock('../../providers/editMode/UseEditMode', () => ({
  default: vi.fn()
}));

import useEditMode from '../../providers/editMode/UseEditMode';

describe('Test ToggleEditMode component', () => {
  it('displays "Desactivate edit mode" when isEditModeActive is true', () => {
    (useEditMode as jest.Mock).mockReturnValue({
      isEditModeActive: true,
    });

    render(<ToggleEditMode />);
    expect(screen.getByText(/Desactivate edit mode/i)).toBeInTheDocument();
  });

  it('displays "Activate edit mode" when isEditModeActive is false', () => {
    (useEditMode as jest.Mock).mockReturnValue({
      isEditModeActive: false,
    });

    render(<ToggleEditMode />);
    expect(screen.getByText(/Activate edit mode/i)).toBeInTheDocument();
  });
});
