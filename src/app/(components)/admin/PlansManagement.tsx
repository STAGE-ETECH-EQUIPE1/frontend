"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Zap, Crown, Target } from "lucide-react"
import type { Plan } from "@/types/admin"

interface PlansManagementProps {
  plans: Plan[]
  onCreatePlan: (plan: Omit<Plan, "id" | "createdAt" | "updatedAt" | "subscribersCount">) => void
  onUpdatePlan: (id: string, plan: Partial<Plan>) => void
  onDeletePlan: (id: string) => void
}

export function PlansManagement({ plans, onCreatePlan, onUpdatePlan, onDeletePlan }: PlansManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "gratuit" as "gratuit" | "premium" | "entreprise",
    price: 0,
    tokens: 0,
    maxTokens: 0,
    features: [] as string[],
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: "gratuit",
      price: 0,
      tokens: 0,
      maxTokens: 0,
      features: [],
      isActive: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPlan) {
      onUpdatePlan(editingPlan.id, formData)
      setEditingPlan(null)
    } else {
      onCreatePlan(formData)
      setIsCreateDialogOpen(false)
    }
    resetForm()
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      tokens: typeof plan.tokens === "number" ? plan.tokens : 0,
      maxTokens: typeof plan.maxTokens === "number" ? plan.maxTokens : 0,
      features: plan.features,
      isActive: plan.isActive,
    })
  }

  const getPlanIcon = (type: string) => {
    switch (type) {
      case "entreprise":
        return Crown
      case "premium":
        return Zap
      default:
        return Target
    }
  }

  const getPlanColor = (type: string) => {
    switch (type) {
      case "entreprise":
        return "from-yellow-400 to-orange-500"
      case "premium":
        return "from-blue-500 to-purple-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Gestion des Plans</h2>
          <p className="text-slate-600 text-sm sm:text-base">Créez et gérez les plans d'abonnement</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nouveau Plan</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-blue-200/30 text-slate-900 max-w-lg sm:max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle className="text-blue-600 text-lg sm:text-xl">Créer un nouveau plan</DialogTitle>
              <DialogDescription className="text-slate-600 text-sm sm:text-base">
                Définissez les caractéristiques du nouveau plan
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-blue-600 text-sm">
                    Nom du plan
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-blue-600 text-sm">
                    Type
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900 text-sm"
                  >
                    <option value="gratuit">Gratuit</option>
                    <option value="premium">Premium</option>
                    <option value="entreprise">Entreprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-blue-600 text-sm">
                    Prix (€/mois)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="tokens" className="text-blue-600 text-sm">
                    Tokens inclus
                  </Label>
                  <Input
                    id="tokens"
                    type="number"
                    value={formData.tokens}
                    onChange={(e) => setFormData({ ...formData, tokens: Number(e.target.value) })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="maxTokens" className="text-blue-600 text-sm">
                    Limite tokens
                  </Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: Number(e.target.value) })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features" className="text-blue-600 text-sm">
                  Fonctionnalités (une par ligne)
                </Label>
                <Textarea
                  id="features"
                  value={formData.features.join("\n")}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value.split("\n").filter(Boolean) })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-blue-600 text-sm">
                  Plan actif
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-sm">
                  Créer le plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {plans.map((plan, index) => {
            const PlanIcon = getPlanIcon(plan.type)
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="bg-white border-blue-200/30 hover:border-blue-200/60 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-r ${getPlanColor(plan.type)} flex items-center justify-center`}
                        >
                          <PlanIcon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-blue-600 text-base sm:text-lg">{plan.name}</CardTitle>
                          <CardDescription className="text-slate-600 capitalize text-sm">{plan.type}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(plan)}
                          className="text-blue-400 hover:bg-blue-400/10 p-1 sm:p-2"
                        >
                          <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeletePlan(plan.id)}
                          className="text-red-400 hover:bg-red-400/10 p-1 sm:p-2"
                        >
                          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                      </div>
                      {plan.price > 0 && <div className="text-sm text-slate-600">/mois</div>}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center p-2 sm:p-3 bg-slate-50 rounded">
                        <div className="text-base sm:text-lg font-bold text-blue-400">
                          {plan.tokens === "unlimited" ? "∞" : plan.tokens}
                        </div>
                        <div className="text-xs text-slate-600">Tokens</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-slate-50 rounded">
                        <div className="text-base sm:text-lg font-bold text-purple-400">{plan.subscribersCount}</div>
                        <div className="text-xs text-slate-600">Abonnés</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-2">Fonctionnalités:</h4>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 2 && (
                          <li className="text-xs text-slate-600">+{plan.features.length - 2} autres...</li>
                        )}
                      </ul>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          plan.isActive
                            ? "bg-green-200 text-green-800 border-green-500 text-xs"
                            : "bg-red-200 text-red-800 border-red-500 text-xs"
                        }
                      >
                        {plan.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <div className="text-xs text-slate-600">
                        {new Date(plan.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="bg-white border-blue-200/30 text-slate-900 max-w-lg sm:max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-lg sm:text-xl">Modifier le plan</DialogTitle>
            <DialogDescription className="text-slate-600 text-sm sm:text-base">
              Modifiez les caractéristiques du plan
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-blue-600 text-sm">
                  Nom du plan
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-type" className="text-blue-600 text-sm">
                  Type
                </Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900 text-sm"
                >
                  <option value="gratuit">Gratuit</option>
                  <option value="premium">Premium</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price" className="text-blue-600 text-sm">
                  Prix (€/mois)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="edit-tokens" className="text-blue-600 text-sm">
                  Tokens inclus
                </Label>
                <Input
                  id="edit-tokens"
                  type="number"
                  value={formData.tokens}
                  onChange={(e) => setFormData({ ...formData, tokens: Number(e.target.value) })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="edit-maxTokens" className="text-blue-600 text-sm">
                  Limite tokens
                </Label>
                <Input
                  id="edit-maxTokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: Number(e.target.value) })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-features" className="text-blue-600 text-sm">
                Fonctionnalités (une par ligne)
              </Label>
              <Textarea
                id="edit-features"
                value={formData.features.join("\n")}
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split("\n").filter(Boolean) })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive" className="text-blue-600 text-sm">
                Plan actif
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingPlan(null)
                  resetForm()
                }}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-sm">
                Sauvegarder
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
