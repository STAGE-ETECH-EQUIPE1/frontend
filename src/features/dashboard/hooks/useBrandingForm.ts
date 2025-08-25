'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateBrandingProjectMutation,
  useGetProjectLogosQuery,
} from '../services/brandingApi'
import {
  createBrandingProjectSchema,
  LogoStyleEnum,
  type CreateBrandingProjectFormData,
} from '../schema/brandingSchema'
import toast from 'react-hot-toast'

export const useBrandingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createProject, { isLoading, error }] =
    useCreateBrandingProjectMutation()
  const form = useForm<CreateBrandingProjectFormData>({
    resolver: zodResolver(createBrandingProjectSchema),
    defaultValues: {
      description: '',
      slogan: '',
      logoStyle: LogoStyleEnum.Modern,
      colorPreferences: [],
      brandKeywords: [],
    },
  })

  const onSubmit = useCallback(
    async (data: CreateBrandingProjectFormData) => {
      try {
        setIsSubmitting(true)

        const result = await createProject(data).unwrap()

        toast.success('votre projet est générer avec succès')

        // Reset form after successful submission
        form.reset()

        return result
      } catch (error) {
        console.error('Erreur lors de la création du projet:', error)

        toast.error('votre projet est générer avec succès')

        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [createProject, form]
  )

  const addKeyword = useCallback(
    (keyword: string) => {
      const currentKeywords = form.getValues('brandKeywords')
      if (!currentKeywords.includes(keyword) && currentKeywords.length < 10) {
        form.setValue('brandKeywords', [...currentKeywords, keyword])
      }
    },
    [form]
  )

  const removeKeyword = useCallback(
    (keywordToRemove: string) => {
      const currentKeywords = form.getValues('brandKeywords')
      form.setValue(
        'brandKeywords',
        currentKeywords.filter((k) => k !== keywordToRemove)
      )
    },
    [form]
  )

  const addColor = useCallback(
    (color: string) => {
      const currentColors = form.getValues('colorPreferences')
      if (!currentColors.includes(color) && currentColors.length < 5) {
        form.setValue('colorPreferences', [...currentColors, color])
      }
    },
    [form]
  )

  const removeColor = useCallback(
    (colorToRemove: string) => {
      const currentColors = form.getValues('colorPreferences')
      form.setValue(
        'colorPreferences',
        currentColors.filter((c) => c !== colorToRemove)
      )
    },
    [form]
  )

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: isSubmitting || isLoading,
    error,
    addKeyword,
    removeKeyword,
    addColor,
    removeColor,
  }
}

export const useProjectLogos = (projectId: string | null) => {
  return useGetProjectLogosQuery(projectId!, {
    skip: !projectId, // Skip query if no projectId
    refetchOnMountOrArgChange: true,
  })
}
