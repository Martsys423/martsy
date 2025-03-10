'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { GRADIENTS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { GitHubApiDemo } from "@/components/github-api-demo"

export default function Home() {
  const { data: session, status } = useSession()

  // Gradient title component for consistent styling
  const GradientTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
      {children}
    </h2>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Martsy Github Analyzer</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {status === 'loading' ? (
              <div>Loading...</div>
            ) : session ? (
              <>
                <Button 
                  asChild 
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="text-sm sm:text-base">Welcome, {session.user?.name}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                    className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Link href="/auth/signin">Sign Up / Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="py-24 bg-gradient-to-b from-purple-400 via-pink-500 to-blue-400">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Unlock GitHub Insights with Martsy
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Get summaries, stats, and cool facts about open source repositories
            </p>
            <Button 
              className={`${GRADIENTS.button} text-white font-semibold px-8 py-3 rounded-full shadow-lg ${GRADIENTS.hover}`}
            >
              Start Analyzing for Free
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GradientTitle>Key Features</GradientTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {[
                { title: "Repository Summaries", description: "Get concise overviews of any GitHub repo" },
                { title: "Star Analytics", description: "Track star growth and patterns" },
                { title: "Cool Facts", description: "Discover interesting tidbits about projects" },
                { title: "PR Insights", description: "Stay updated on important pull requests" },
                { title: "Version Tracking", description: "Monitor major version updates" },
                { title: "Trend Analysis", description: "Spot rising stars in the open-source world" },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Demo Section - Now positioned after Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <GradientTitle>Try It Yourself</GradientTitle>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Test our GitHub Analyzer API directly in your browser. Enter a repository URL and see what insights you can discover.
            </p>
            <GitHubApiDemo />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <GradientTitle>Simple Pricing</GradientTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {[
                {
                  title: "Free",
                  price: "$0",
                  features: [
                    "5 repo analyses per month", 
                    "Basic insights", 
                    "Daily updates",
                    "Community support"
                  ],
                  cta: "Get Started",
                },
                {
                  title: "Pro",
                  price: "$9.99",
                  features: ["50 repo analyses per month", "Advanced insights", "Hourly updates", "API access"],
                  cta: "Upgrade to Pro",
                  comingSoon: true,
                },
                {
                  title: "Enterprise",
                  price: "Custom",
                  features: ["Unlimited analyses", "Custom integrations", "Dedicated support", "On-premise option"],
                  cta: "Contact Sales",
                  comingSoon: true,
                },
              ].map((plan, index) => (
                <Card key={index} className={`${index === 1 ? "border-purple-500 border-2" : ""} relative`}>
                  {plan.comingSoon && (
                    <Badge 
                      className="absolute top-4 right-4" 
                      variant="secondary"
                    >
                      Coming Soon
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full transition-all duration-200 shadow-md hover:shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Martsy Github Analyzer</p>
        </div>
      </footer>
    </div>
  )
}

