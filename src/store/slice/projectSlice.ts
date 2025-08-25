import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ProjectState {
  selectedProjectId: number | null
  projectName: string | null
}

const initialState: ProjectState = {
  selectedProjectId: null,
  projectName: null,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (
      state,
      action: PayloadAction<{ id: number; name?: string }>
    ) => {
      if (action.payload.id && action.payload.id > 0) {
        state.selectedProjectId = action.payload.id
        state.projectName = action.payload.name || null
      } else {
        console.warn('Attempted to set invalid project ID:', action.payload.id)
      }
    },
    clearSelectedProject: (state) => {
      state.selectedProjectId = null
      state.projectName = null
    },
  },
})

export const { setSelectedProject, clearSelectedProject } = projectSlice.actions
export default projectSlice.reducer
