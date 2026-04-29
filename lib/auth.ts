import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const adminEmail = process.env.ADMIN_EMAIL
if (!adminEmail) throw new Error('ADMIN_EMAIL env var is required')

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === adminEmail
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
})
