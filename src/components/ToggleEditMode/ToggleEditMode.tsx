import { useEffect } from 'react';
import useEditMode from '../../providers/editMode/UseEditMode';
import './ToggleEditMode.css'

function ToggleEditMode() {
  const { isEditModeActive, toggleEditMode } = useEditMode();

  useEffect(() => {
    console.log('EDIT', isEditModeActive)
  }, [isEditModeActive])

  return (
    <div className="toggle-edit-container">
      <div>
      <span>
        {isEditModeActive ? "Desactivate" : "Activate"} edit mode
      </span>
      </div>
      <label className="switch">
        <input type="checkbox" onClick={toggleEditMode} />
      <span className="slider round"></span>
      </label>
    </div>
  )
}

export default ToggleEditMode