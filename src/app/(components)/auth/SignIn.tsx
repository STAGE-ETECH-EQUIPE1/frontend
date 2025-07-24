'use client'

import type React from 'react'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/store/api/authApi'
import { setToken } from '@/features/authSlice'
import toast from 'react-hot-toast'
import GoogleLoginButton from '../googlebutton/GoogleLoginButton'

const SignIn = () => {
  const t = useTranslations('auth.signin')
  const toastMessage = useTranslations('toast')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await login(formData).unwrap()
      dispatch(setToken(res.token))
      toast.success(toastMessage('successLogin'))
    } catch (err) {
      toast.error(toastMessage('errorLogin'))
      console.error('Erreur :', err)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          {t('title')}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {t('subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Forgot Password */}
        <div className="text-right">
          <a
            href="#forgot"
            className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
          >
            {t('forgotPassword')}
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 btn-premium text-base font-semibold"
          disabled={isLoading}
        >
          {t('submit')}
        </Button>
        {error && <p style={{ color: 'red' }}>Erreur lors de la connexion</p>}

        {/* Divider */}
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

        {/* Social Login */}
        <div className="space-y-3">
          <GoogleLoginButton />
        </div>
      </form>
    </div>
  )
}

export default SignIn
