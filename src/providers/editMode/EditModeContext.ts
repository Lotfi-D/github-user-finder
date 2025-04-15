import { createContext } from "react";

type EditModeContextType = {
  isEditModeActive: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export default EditModeContext;
