'use client'

import { useState, useEffect } from 'react'
import { serviceApi } from '../services/serviceApi'
import type {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '../types/service'
import toast from 'react-hot-toast'

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await serviceApi.getServices()
      setServices(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (data: CreateServiceRequest) => {
    try {
      setLoading(true)
      await serviceApi.createService(data)
      await fetchServices() // Refresh the list
      toast.success('Service créé avec succès')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la création'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (id: number, data: UpdateServiceRequest) => {
    try {
      setLoading(true)
      await serviceApi.updateService(id, data)
      await fetchServices() // Refresh the list
      toast.success('Service mis à jour avec succès')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteService = async (id: number) => {
    try {
      setLoading(true)
      await serviceApi.deleteService(id)
      await fetchServices() // Refresh the list
      toast.success('Service supprimé avec succès')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  }
}
