import Google from "next-auth/providers/google"
import { AuthOptions } from "next-auth"
import { supabase } from '@/app/utils/supabase'

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (user && account) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            const { error } = await supabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  auth_provider: account.provider,
                  last_sign_in: new Date().toISOString(),
                }
              ])

            if (error) throw error
          }
        } catch (error) {
          console.error('Error saving user to Supabase:', error)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
} 