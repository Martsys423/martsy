import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { supabase } from '@/app/utils/supabase'

const handler = NextAuth({
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
          // Check if user already exists in Supabase
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // If user doesn't exist, insert them into Supabase
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
          // Still allow sign in even if Supabase save fails
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
})

export { handler as GET, handler as POST } 