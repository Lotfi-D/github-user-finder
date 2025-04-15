import { useState } from "react";
import EditModeContext from "./EditModeContext";

type Props = {
  children: React.ReactNode;
};

function EditModeProvider ({ children }: Props) {
  // const editModeSaved = JSON.parse(localStorage.getItem('isEditModeActive') || 'false');
  // const [isEditModeActive, setIsEditModeActive] = useState(editModeSaved || false);

  const [isEditModeActive, setIsEditModeActive] = useState(() => {
    const storedValue = localStorage.getItem("isEditModeActive");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const toggleEditMode = () => setIsEditModeActive((prev: boolean) => {
    localStorage.setItem('isEditModeActive', JSON.stringify(!prev))
    return !prev
  });

  return (
    <EditModeContext.Provider value={{ isEditModeActive, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export default EditModeProvider;
