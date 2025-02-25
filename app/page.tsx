'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Martsy Github Analyzer</h1>
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div>Loading...</div>
            ) : session ? (
              <>
                <Button asChild variant="default">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <div className="flex items-center gap-4">
                  <span>Welcome, {session.user?.name}</span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign Up / Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Unlock GitHub Insights with Martsy</h2>
            <p className="text-xl mb-8">Get summaries, stats, and cool facts about open source repositories</p>
            <Button size="lg" asChild>
              <Link href="/auth/signin">Start Analyzing for Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
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

        {/* Pricing Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Free",
                  price: "$0",
                  features: ["5 repo analyses per month", "Basic insights", "Daily updates"],
                  cta: "Get Started",
                },
                {
                  title: "Pro",
                  price: "$9.99",
                  features: ["50 repo analyses per month", "Advanced insights", "Hourly updates", "API access"],
                  cta: "Upgrade to Pro",
                },
                {
                  title: "Enterprise",
                  price: "Custom",
                  features: ["Unlimited analyses", "Custom integrations", "Dedicated support", "On-premise option"],
                  cta: "Contact Sales",
                },
              ].map((plan, index) => (
                <Card key={index} className={index === 1 ? "border-purple-500 border-2" : ""}>
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
                    <Button className="w-full">{plan.cta}</Button>
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

