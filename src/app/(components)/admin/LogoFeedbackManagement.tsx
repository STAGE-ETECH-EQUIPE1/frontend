"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Reply,
  Trash2,
} from "lucide-react"
import type { LogoFeedback } from "@/types/admin"

interface FeedbackManagementProps {
  feedbacks: LogoFeedback[]
  onUpdateFeedback: (id: string, updates: Partial<LogoFeedback>) => void
  onDeleteFeedback: (id: string) => void
  onRespondToFeedback: (id: string, response: string) => void
}

export function FeedbackManagement({
  feedbacks,
  onUpdateFeedback,
  onDeleteFeedback,
  onRespondToFeedback,
}: FeedbackManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedFeedback, setSelectedFeedback] = useState<LogoFeedback | null>(null)
  const [responseDialog, setResponseDialog] = useState<{ open: boolean; feedback: LogoFeedback | null }>({
    open: false,
    feedback: null,
  })
  const [responseText, setResponseText] = useState("")

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.logoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter
    const matchesRating = ratingFilter === "all" || feedback.rating.toString() === ratingFilter
    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "pending":
        return Clock
      default:
        return Clock
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const handleStatusChange = (feedbackId: string, newStatus: LogoFeedback["status"]) => {
    onUpdateFeedback(feedbackId, { status: newStatus })
  }

  const handleSendResponse = () => {
    if (responseDialog.feedback && responseText.trim()) {
      onRespondToFeedback(responseDialog.feedback.id, responseText)
      onUpdateFeedback(responseDialog.feedback.id, {
        adminResponse: responseText,
        status: "approved",
      })
      setResponseDialog({ open: false, feedback: null })
      setResponseText("")
    }
  }

  const averageRating =
    feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : "0.0"

  const statusCounts = {
    pending: feedbacks.filter((f) => f.status === "pending").length,
    approved: feedbacks.filter((f) => f.status === "approved").length,
    rejected: feedbacks.filter((f) => f.status === "rejected").length,
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Gestion des Commentaires</h2>
          <p className="text-slate-600 text-sm sm:text-base">Modérez les avis et commentaires des utilisateurs</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
            {filteredFeedbacks.length} commentaire{filteredFeedbacks.length > 1 ? "s" : ""}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs sm:text-sm">
            ⭐ {averageRating} moyenne
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "En attente",
            value: statusCounts.pending,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          },
          {
            title: "Approuvés",
            value: statusCounts.approved,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          },
          {
            title: "Rejetés",
            value: statusCounts.rejected,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className={`bg-white ${stat.borderColor} border hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-blue-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher dans les commentaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700 text-sm"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredFeedbacks.map((feedback, index) => {
            const StatusIcon = getStatusIcon(feedback.status)
            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Logo Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                          <img
                            src={feedback.logoUrl || "/placeholder.svg"}
                            alt={feedback.logoName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={feedback.userAvatar || "/placeholder.svg"} alt={feedback.userName} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                {feedback.userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{feedback.userName}</div>
                              <div className="text-xs text-slate-600">{feedback.logoName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(feedback.status)} text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {feedback.status === "pending"
                                ? "En attente"
                                : feedback.status === "approved"
                                  ? "Approuvé"
                                  : "Rejeté"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-100 p-1">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedFeedback(feedback)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setResponseDialog({ open: true, feedback })}>
                                  <Reply className="w-4 h-4 mr-2" />
                                  Répondre
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {feedback.status !== "approved" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "approved")}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approuver
                                  </DropdownMenuItem>
                                )}
                                {feedback.status !== "rejected" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "rejected")}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeter
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDeleteFeedback(feedback.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(feedback.rating)}</div>
                          <span className="text-sm text-slate-600">({feedback.rating}/5)</span>
                        </div>

                        {/* Comment */}
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{feedback.comment}</p>
                        </div>

                        {/* Admin Response */}
                        {feedback.adminResponse && (
                          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                            <div className="text-xs font-medium text-blue-600 mb-1">Réponse de l'équipe:</div>
                            <p className="text-sm text-blue-700">{feedback.adminResponse}</p>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>Catégorie: {feedback.category}</span>
                          <span>Style: {feedback.style}</span>
                          <span>{new Date(feedback.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Feedback Details Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Détails du commentaire</DialogTitle>
            <DialogDescription>Informations complètes sur le feedback</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={selectedFeedback.logoUrl || "/placeholder.svg"}
                    alt={selectedFeedback.logoName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">{selectedFeedback.logoName}</h3>
                  <p className="text-slate-600">Par {selectedFeedback.userName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">{renderStars(selectedFeedback.rating)}</div>
                    <Badge className={`${getStatusColor(selectedFeedback.status)} text-xs`}>
                      {selectedFeedback.status === "pending"
                        ? "En attente"
                        : selectedFeedback.status === "approved"
                          ? "Approuvé"
                          : "Rejeté"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Commentaire</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700">{selectedFeedback.comment}</p>
                  </div>
                </div>

                {selectedFeedback.adminResponse && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Réponse de l'équipe</h4>
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-blue-700">{selectedFeedback.adminResponse}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Catégorie:</span>
                    <span className="ml-2 text-slate-800">{selectedFeedback.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Style:</span>
                    <span className="ml-2 text-slate-800">{selectedFeedback.style}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Date:</span>
                    <span className="ml-2 text-slate-800">
                      {new Date(selectedFeedback.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Note:</span>
                    <span className="ml-2 text-slate-800">{selectedFeedback.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog
        open={responseDialog.open}
        onOpenChange={(open) => setResponseDialog({ open, feedback: responseDialog.feedback })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-600">Répondre au commentaire</DialogTitle>
            <DialogDescription>
              Répondre à {responseDialog.feedback?.userName} concernant "{responseDialog.feedback?.logoName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {responseDialog.feedback && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(responseDialog.feedback.rating)}</div>
                  <span className="text-sm text-slate-600">({responseDialog.feedback.rating}/5)</span>
                </div>
                <p className="text-sm text-slate-700 italic">"{responseDialog.feedback.comment}"</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700">Votre réponse</label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Rédigez votre réponse..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponseDialog({ open: false, feedback: null })}>
                Annuler
              </Button>
              <Button onClick={handleSendResponse} className="bg-blue-600 hover:bg-blue-700">
                <Reply className="w-4 h-4 mr-2" />
                Envoyer la réponse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredFeedbacks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg">Aucun commentaire trouvé</div>
          <p className="text-sm text-slate-500 mt-2">Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}
    </motion.div>
  )
}
