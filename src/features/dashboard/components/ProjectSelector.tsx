'use client'

import { useSelectedProject } from '../hooks/useSelectedProject' 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Project {
  id: number
  name: string
}

interface ProjectSelectorProps {
  projects: Project[]
  onProjectChange?: (projectId: number) => void
}

export function ProjectSelector({
  projects,
  onProjectChange,
}: ProjectSelectorProps) {
  const { selectedProjectId, selectProject, hasValidProject } =
    useSelectedProject()

  const handleProjectSelect = (value: string) => {
    const projectId = Number.parseInt(value)
    const project = projects.find((p) => p.id === projectId)

    if (project) {
      selectProject(project.id, project.name)
      onProjectChange?.(project.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un projet</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedProjectId?.toString() || ''}
          onValueChange={handleProjectSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un projet..." />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!hasValidProject && (
          <p className="text-sm text-yellow-600 mt-2">
            Aucun projet sélectionné
          </p>
        )}
      </CardContent>
    </Card>
  )
}
