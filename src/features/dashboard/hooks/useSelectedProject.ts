import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { setSelectedProject, clearSelectedProject } from "@/store/slice/projectSlice"

export const useSelectedProject = () => {
  const dispatch = useDispatch()
  const { selectedProjectId, projectName } = useSelector((state: RootState) => state.project)

  const selectProject = (id: number, name?: string) => {
    if (id && id > 0) {
      dispatch(setSelectedProject({ id, name }))
    } else {
      console.warn("Invalid project ID provided:", id)
    }
  }

  const clearProject = () => {
    dispatch(clearSelectedProject())
  }

  const hasValidProject = selectedProjectId !== null && selectedProjectId > 0

  return {
    selectedProjectId,
    projectName,
    selectProject,
    clearProject,
    hasValidProject, // New helper property
  }
}
