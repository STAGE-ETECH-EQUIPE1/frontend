'use client'

import type React from 'react'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { setToken } from '@/store/slice/slice'
import toast from 'react-hot-toast'
import GoogleLoginButton from '@/shared/components/googlebutton/GoogleLoginButton'
import { redirectAccordingToRole } from '@/i18n/routes'
import { useRouter } from 'next/navigation'
import ForgotPassword from './ForgotPassword'
import { Dialog, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import { useLoginForm } from '../hooks/useLogin'
import { FormProvider } from 'react-hook-form'
import { LoginFormData } from '../schema/loginSchema'

const SignIn = () => {
  const t = useTranslations('auth.signin')
  const toastMessage = useTranslations('toast')
  const router = useRouter()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const { methods, login, loginState } = useLoginForm()
  const [authMethod, setAuthMethod] = useState<'form' | 'google' | null>(null)

  const onSubmit = async (data: LoginFormData) => {
    setAuthMethod('form')
    try {
      const res = await login(data).unwrap()
      dispatch(setToken(res.token))
      redirectAccordingToRole(res.token, router)
      if (authMethod !== 'google') {
        toast.success(toastMessage('successLogin'))
      }
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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="votre@email.com"
                {...methods.register('email')}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...methods.register('password')}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 btn-premium text-base font-semibold"
            disabled={loginState.isLoading}
          >
            {loginState.isLoading && (
              <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
            )}
            {t('submit')}
          </Button>

          {/* Error Display */}
          {loginState.error && (
            <p className="text-red-500 text-sm">{toastMessage('errorLogin')}</p>
          )}
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
        </form>
      </FormProvider>
      {/* Social Login */}
      <div className="space-y-3">
        <GoogleLoginButton setAuthMethod={() => {}} authContext="login" />
      </div>
      {/* Forgot Password */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-primary text-sm hover:underline">
            {t('forgotPassword')}
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>

          <ForgotPassword />
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default SignIn
