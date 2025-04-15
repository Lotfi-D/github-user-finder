import { useState } from "react";
import EditModeContext from "./EditModeContext";

type Props = {
  children: React.ReactNode;
};

function EditModeProvider ({ children }: Props) {
  const [isEditModeActive, setIsEditModeActive] = useState(false);

  const toggleEditMode = () => setIsEditModeActive((prev) => {
    console.log('prev', prev);
    return !prev
  });

  return (
    <EditModeContext.Provider value={{ isEditModeActive, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export default EditModeProvider;
