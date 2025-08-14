'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { FormProvider } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Check, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useResetPasswordForm } from '../hooks/useResetPassword'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
}

const PasswordCriteria = ({ password }: { password: string }) => {
  const t = useTranslations('auth.resetPassword')

  const criteria = [
    { labelKey: 'criteria.minLength', test: (p: string) => p.length >= 8 },
    { labelKey: 'criteria.uppercase', test: (p: string) => /[A-Z]/.test(p) },
    { labelKey: 'criteria.lowercase', test: (p: string) => /[a-z]/.test(p) },
    { labelKey: 'criteria.number', test: (p: string) => /[0-9]/.test(p) },
    {
      labelKey: 'criteria.special',
      test: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">
        {t('criteria.title')}
      </p>
      <div className="space-y-2">
        {criteria.map((criterion, index) => {
          const isValid = password ? criterion.test(password) : false
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className={`
                w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                ${
                  isValid
                    ? 'bg-emerald-100 border-2 border-emerald-500'
                    : 'bg-slate-100 border-2 border-slate-300'
                }
              `}
              >
                {isValid ? (
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                ) : (
                  <X className="w-3 h-3 text-slate-400" strokeWidth={2} />
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isValid ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                {t(criterion.labelKey)}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const t = useTranslations('auth.resetPassword')

  const getStrength = (password: string) => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score += 20
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 20
    if (/[^A-Za-z0-9]/.test(password)) score += 20
    return score
  }

  const strength = getStrength(password)
  const getColor = () => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 60) return 'bg-orange-500'
    if (strength < 80) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const getLabel = () => {
    if (strength < 40) return t('strength.weak')
    if (strength < 60) return t('strength.medium')
    if (strength < 80) return t('strength.good')
    return t('strength.excellent')
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">
          {t('strength.title')}
        </span>
        <span
          className={`text-sm font-semibold ${
            strength < 40
              ? 'text-red-600'
              : strength < 60
                ? 'text-orange-600'
                : strength < 80
                  ? 'text-yellow-600'
                  : 'text-emerald-600'
          }`}
        >
          {getLabel()}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
    </div>
  )
}

export default function ProfessionalResetModal({
  isOpen,
  onClose,
  token,
}: ResetPasswordModalProps) {
  const t = useTranslations('auth.resetPassword')
  const { methods, onSubmit, isLoading } = useResetPasswordForm(token)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step] = useState(1)

  const watchPassword = methods.watch('newPassword') || ''
  const watchConfirmPassword = methods.watch('confirmPassword') || ''

  const passwordsMatch =
    watchPassword &&
    watchConfirmPassword &&
    watchPassword === watchConfirmPassword

  const isPasswordValid =
    watchPassword.length >= 8 &&
    /[A-Z]/.test(watchPassword) &&
    /[a-z]/.test(watchPassword) &&
    /[0-9]/.test(watchPassword) &&
    /[^A-Za-z0-9]/.test(watchPassword)

  const canProceed = isPasswordValid && passwordsMatch

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[540px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-white border-0 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] focus:outline-none [&>button]:hidden">
            <VisuallyHidden>
              <DialogTitle>{t('title')}</DialogTitle>
            </VisuallyHidden>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white"
            >
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {t('header.title')}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {t('header.subtitle')}
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      step >= 1 ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                      step >= 2 ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      step >= 2 ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="px-8 pb-8">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Password Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        {t('fields.newPassword.label')}
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('fields.newPassword.placeholder')}
                          className="h-12 pl-4 pr-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-base"
                          {...methods.register('newPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength */}
                    {watchPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <PasswordStrengthBar password={watchPassword} />
                      </motion.div>
                    )}

                    {/* Confirm Password Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        {t('fields.confirmPassword.label')}
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={t('fields.confirmPassword.placeholder')}
                          className={`h-12 pl-4 pr-12 border-2 rounded-xl focus:ring-0 transition-all duration-200 text-base ${
                            watchConfirmPassword
                              ? passwordsMatch
                                ? 'border-emerald-300 focus:border-emerald-500'
                                : 'border-red-300 focus:border-red-500'
                              : 'border-slate-200 focus:border-blue-500'
                          }`}
                          {...methods.register('confirmPassword')}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </div>

                      {/* Match indicator */}
                      {watchConfirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center gap-2 text-sm ${
                            passwordsMatch ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {passwordsMatch ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          {passwordsMatch
                            ? t('validation.passwordsMatch')
                            : t('validation.passwordsDontMatch')}
                        </motion.div>
                      )}
                    </div>

                    {/* Password Criteria */}
                    {watchPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-slate-50 rounded-2xl p-5"
                      >
                        <PasswordCriteria password={watchPassword} />
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={!canProceed || isLoading}
                        className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 ${
                          canProceed && !isLoading
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            {t('button.loading')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {t('button.submit')}
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    {/* Footer */}
                    <div className="text-center pt-4">
                      <p className="text-sm text-slate-500">
                        {t('footer.text')}{' '}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {t('footer.link')}
                        </a>
                      </p>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
