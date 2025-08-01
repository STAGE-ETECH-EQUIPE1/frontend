"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Shield, Crown, Key, Bell, Save, Upload, Activity } from "lucide-react"
import type { AdminUser } from "@/types/admin"

interface AdminProfileProps {
  admin: AdminUser
}

export function AdminProfile({ admin }: AdminProfileProps) {
  const t = useTranslations("admin.profile")
  const tCommon = useTranslations("admin.common")

  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    systemAlerts: true,
    userRegistrations: false,
    criticalErrors: true,
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "from-red-500 to-pink-500"
      case "admin":
        return "from-blue-500 to-purple-500"
      default:
        return "from-green-500 to-teal-500"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return Crown
      case "admin":
        return Shield
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(admin.role)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", formData)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password changed")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{t("title")}</h2>
          <p className="text-slate-600 text-sm sm:text-base">{t("subtitle")}</p>
        </div>
        <Badge className={`bg-gradient-to-r ${getRoleColor(admin.role)} text-white border-0 text-sm`}>
          <RoleIcon className="w-4 h-4 mr-2" />
          {admin.role.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 sm:w-5 h-4 sm:h-5" />
                {t("personalInfo")}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">{t("editBasicInfo")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="w-16 sm:w-20 h-16 sm:h-20 ring-4 ring-blue-200">
                      <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                      <AvatarFallback
                        className={`bg-gradient-to-r ${getRoleColor(admin.role)} text-white text-lg sm:text-xl`}
                      >
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-600">{admin.name}</h3>
                    <p className="text-slate-600 text-sm sm:text-base">{admin.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={`bg-gradient-to-r ${getRoleColor(admin.role)} text-white border-0 text-xs`}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {admin.role.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-600">
                        {t("memberSince")} {new Date(admin.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-blue-600 text-sm">
                      {t("fullName")}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-blue-600 text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-sm">
                    <Save className="w-4 h-4 mr-2" />
                    {tCommon("save")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Key className="w-4 sm:w-5 h-4 sm:h-5" />
                {t("changePassword")}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">{t("secureAccount")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-blue-600 text-sm">
                    {t("currentPassword")}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword" className="text-blue-600 text-sm">
                      {t("newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-blue-600 text-sm">
                      {t("confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-sm">
                    <Key className="w-4 h-4 mr-2" />
                    {t("changePassword")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
                {t("notificationPrefs")}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">{t("configureAlerts")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailAlerts",
                  label: t("emailAlerts"),
                  description: t("emailAlertsDesc"),
                },
                {
                  key: "systemAlerts",
                  label: t("systemAlerts"),
                  description: t("systemAlertsDesc"),
                },
                {
                  key: "userRegistrations",
                  label: t("userRegistrations"),
                  description: t("userRegistrationsDesc"),
                },
                {
                  key: "criticalErrors",
                  label: t("criticalErrors"),
                  description: t("criticalErrorsDesc"),
                },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-600 text-sm">{setting.label}</div>
                    <div className="text-xs sm:text-sm text-slate-600">{setting.description}</div>
                  </div>
                  <Switch
                    checked={notifications[setting.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [setting.key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Activity */}
        <div className="space-y-6">
          {/* Admin Stats */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 sm:w-5 h-4 sm:h-5" />
                {t("adminStats")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: t("sessionsToday"),
                  value: "12",
                  color: "text-blue-400",
                },
                {
                  label: t("actionsPerformed"),
                  value: "47",
                  color: "text-green-400",
                },
                {
                  label: t("usersManaged"),
                  value: "156",
                  color: "text-purple-400",
                },
                {
                  label: t("connectionTime"),
                  value: "4h 23m",
                  color: "text-yellow-400",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-xs sm:text-sm text-slate-700">{stat.label}</span>
                  <span className={`font-semibold ${stat.color} text-sm`}>{stat.value}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                {t("permissions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {admin.permissions.includes("all") ? (
                  <Badge className="bg-green-100 text-green-700 border-green-500 w-full justify-center text-sm">
                    <Crown className="w-3 h-3 mr-1" />
                    {t("fullAccess")}
                  </Badge>
                ) : (
                  admin.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="text-xs border-slate-300 w-full justify-center"
                    >
                      {permission}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 text-base sm:text-lg">{t("recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: t("userSuspended"), time: "Il y a 2h" },
                  { action: t("planModified"), time: "Il y a 4h" },
                  { action: t("feedbackApproved"), time: "Il y a 6h" },
                  { action: t("adminLogin"), time: "Il y a 8h" },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700 text-xs sm:text-sm truncate">{activity.action}</span>
                    <span className="text-slate-600 text-xs whitespace-nowrap">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
