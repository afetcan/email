import type { inferRouterInputs } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context'
import { EmailInputShape } from './shapes'
import { renderEmailVerificationEmail } from './templates/email-verification'
import { renderPasswordResetEmail } from './templates/password-reset'

const t = initTRPC.context<Context>().create()
const awsGlobal = 'https://acildeprem.s3.eu-central-1.amazonaws.com/global'
const logo = `${awsGlobal}/acildeprem_logo.png`
const headerImage = `${awsGlobal}/mail-header.png`
const footerImage = `${awsGlobal}/mail-bottom.png`

export const emailsApiRouter = t.router({
  schedule: t.procedure.input(EmailInputShape).mutation(async ({ ctx, input }) => {
    try {
      const job = await ctx.schedule(input)

      return { job: job.id ?? 'unknown' }
    }
    catch (error) {
      ctx.errorHandler('Failed to schedule an email', error as Error, ctx.logger)
      throw error
    }
  }),
  sendEmailVerificationEmail: t.procedure
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          id: z.string(),
        }),
        emailVerifyLink: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const subject = 'Verify your email'

        const job = await ctx.schedule({
          id: `email-verification-${input.user.id}-${new Date().getTime()}`,
          email: input.user.email,
          subject,
          body: renderEmailVerificationEmail({
            subject,
            verificationLink: input.emailVerifyLink,
            toEmail: input.user.email,
          }),
        })

        return { job: job.id ?? 'unknown' }
      }
      catch (error) {
        ctx.errorHandler('Failed to schedule an email', error as Error, ctx.logger)
        throw error
      }
    }),
  sendPasswordResetEmail: t.procedure
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          id: z.string(),
        }),
        passwordResetLink: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const subject = 'Reset your password.'
        const job = await ctx.schedule({
          id: `password-reset-${input.user.id}-${new Date().getTime()}`,
          email: input.user.email,
          subject,
          body: renderPasswordResetEmail({
            hi: 'Password reset',
            title: 'Şifre Sıfırlama - Acil Deprem',
            description: 'Password reset link for your account on acildeprem',
            buttonText: 'Click here to reset your password',
            buttonURL: input.passwordResetLink,
            footer: `If your link doesn't work, copy and paste the following link into your browser: ${input.passwordResetLink}`,
            pageTitle: 'acildeprem',
            thankYou: 'Thank you <br> acildeprem Team',
            projectAddress: `
        © 2023 Acil Deprem, Turkiye <br>`,
            projectName: 'acildeprem',
            logoAlt: 'acildeprem',
            logoURL: logo,
            headerImageURL: headerImage,
            footerImageURL: footerImage,
            pageHeader: 'acildeprem',
            pageLanguage: 'en',
            appStoreURL: 'id1494667688',
            playStoreURL: 'com.com.com',
            connectText: 'Connect with us',
            docsURL: 'https://docs.acildeprem.com',
            liveChatURL: 'https://acildeprem.com',
            youtubeURL: 'https://www.youtube.com',
          }),
        })
        return { job: job.id ?? 'unknown' }
      }
      catch (error) {
        ctx.errorHandler('Failed to schedule an email', error as Error, ctx.logger)
        throw error
      }
    }),

  passwordReset: t.procedure
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          id: z.string(),
        }),
        passwordResetLink: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const subject = ''
        const job = await ctx.schedule({
          id: `password-reset-${input.user.id}-${new Date().getTime()}`,
          email: input.user.email,
          subject,
          body: renderPasswordResetEmail({
            hi: 'Password reset',
            title: 'Şifre Sıfırlama - Acil Deprem',
            description: 'Password reset link for your account on acildeprem',
            buttonText: 'Click here to reset your password',
            buttonURL: input.passwordResetLink,
            footer: `If your link doesn't work, copy and paste the following link into your browser: ${input.passwordResetLink}`,
            pageTitle: 'acildeprem',
            thankYou: 'Thank you <br> acildeprem Team',
            projectAddress: `
        © 2023 Acil Deprem, Turkiye <br>`,
            projectName: 'acildeprem',
            logoAlt: 'acildeprem',
            logoURL: logo,
            headerImageURL: headerImage,
            footerImageURL: footerImage,
            pageHeader: 'acildeprem',
            pageLanguage: 'en',
            appStoreURL: 'id1494667688',
            playStoreURL: 'com.com.com',
            connectText: 'Connect with us',
            docsURL: 'https://docs.acildeprem.com',
            liveChatURL: 'https://acildeprem.com',
            youtubeURL: 'https://www.youtube.com',
          }),
        })
        return { job: job.id ?? 'unknown' }
      }
      catch (error) {
        ctx.errorHandler('Failed to schedule an email', error as Error, ctx.logger)
        throw error
      }
    }),
})

export type EmailsApi = typeof emailsApiRouter
export type EmailsApiInput = inferRouterInputs<EmailsApi>
