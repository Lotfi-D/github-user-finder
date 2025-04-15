import useEditMode from '../../providers/editMode/UseEditMode';
import './ToggleEditMode.css'

function ToggleEditMode() {
  const { isEditModeActive, toggleEditMode } = useEditMode();

  return (
    <div className="toggle-edit-container">
      <div>
      <span>
        {isEditModeActive ? "Desactivate" : "Activate"} edit mode
      </span>
      </div>
      <label className="switch">
        <input type="checkbox" checked={isEditModeActive} onClick={toggleEditMode} />
        <span className="slider round"></span>
      </label>
    </div>
  )
}

export default ToggleEditMode