'use client'

import React from 'react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { useSignupMutation } from '@/store/api/authApi'
import { setToken } from '@/features/authSlice'
import GoogleLoginButton from '../googlebutton/GoogleLoginButton'

const SignUp = () => {
  const t = useTranslations('auth.signup')
  const toastMessage = useTranslations('toast')
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const [authMethod, setAuthMethod] = useState<'form' | 'google' | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthMethod('form')

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(toastMessage('confirmPassword'))
      return
    }

    try {
      const res = await signup(formData).unwrap()
      dispatch(setToken(res.token))
      if (authMethod === 'form') {
        toast.success(toastMessage('successSignup'))
      } else if (authMethod === 'google') {
        toast.success(toastMessage('successSignupGoogle'))
      }
    } catch (err) {
      toast.error(toastMessage('errorSignup'))
      console.error(err)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {t('title')}
        </h2>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep >= 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            1
          </div>
          <div
            className={`w-8 h-1 rounded-full transition-colors ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep >= 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            2
          </div>
          <div
            className={`w-8 h-1 rounded-full transition-colors ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep >= 3
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <>
            {/* Step 1: Personal Info */}
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  {t('email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground"
                >
                  {t('phone')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-foreground"
              >
                {t('fullName')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                {t('username')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="votre_nom_utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Step 3: Security */}
            <div className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  {t('password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  {t('confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 text-sm pt-4">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  className="w-4 h-4 text-primary border-border/50 rounded focus:ring-primary/20 mt-0.5"
                  required
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-muted-foreground leading-relaxed"
                >
                  {t('acceptTerms')}{' '}
                  <a
                    href="#terms"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {t('termsOfService')}
                  </a>{' '}
                  {t('and')}{' '}
                  <a
                    href="#privacy"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {t('privacyPolicy')}
                  </a>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12 bg-background/50 border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
          )}
          <Button
            type="submit"
            className={`h-12 btn-premium text-base font-semibold ${currentStep === 1 ? 'w-full' : 'flex-1'}`}
            disabled={isLoading}
          >
            {currentStep === 3 ? (
              t('createAccount')
            ) : (
              <>
                {t('next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Social Login - Maintenant affiché sur toutes les étapes */}
      <div className="mt-6">
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">
              {t('or')}
            </span>
          </div>
        </div>

        <GoogleLoginButton setAuthMethod={setAuthMethod} authContext="signup" />
      </div>
    </div>
  )
}

export default SignUp
