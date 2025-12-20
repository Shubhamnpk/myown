"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createGuestUser, getCurrentUser } from "@/utils/userManagement"
import { useRouter } from "next/navigation"
import { LineChart, CheckCircle, Star, Users, Target, Clock, ArrowRight, Sparkles, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Designer",
    content:
      "myown transformed how I manage my projects. The intuitive interface and powerful features help me stay organized and focused.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    content:
      "The productivity tracking features have helped our team improve efficiency by 40%. It's an indispensable tool for our workflow.",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Content Creator",
    content:
      "The resource library is a game-changer. I can finally keep all my assets organized in one place. It's boosted my productivity significantly.",
    rating: 5,
  },
]

const stats = [
  { label: "Active Users", value: "10,000+", icon: Users },
  { label: "Tasks Completed", value: "1M+", icon: CheckCircle },
  { label: "Time Saved", value: "1000+ hrs", icon: Clock },
]

export default function WelcomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [returningUser, setReturningUser] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setReturningUser(user.name)
    }
  }, [])

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      await createGuestUser()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating guest user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const ThemeSwitcher = () => (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 bg-background/50 backdrop-blur-lg border border-border/50"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-primary/20 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 via-primary/10 to-gray-200 text-gray-900"
      } overflow-hidden`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme === "dark" ? "from-primary/10" : "from-primary/5"} via-primary/5 to-transparent animate-pulse`}
        ></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center space-y-8"
          >
            <AnimatePresence>
              {returningUser && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${theme === "dark" ? "bg-primary/10" : "bg-primary/5"} backdrop-blur-lg p-6 rounded-lg border border-primary/20`}
                >
                  <h2 className="text-2xl font-bold">
                    <Sparkles className="inline-block mr-2" />
                    Welcome back, {returningUser}!
                  </h2>
                  <p className={theme === "dark" ? "text-gray-200" : "text-gray-600"}>It's great to see you again.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <h1 className="text-6xl md:text-7xl font-bold">
              Welcome to <span className="text-primary">myown</span>
            </h1>
            <p className={`text-xl md:text-2xl max-w-2xl ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
              Your all-in-one productivity solution for seamless task management, resource organization, and performance
              tracking.
            </p>

            <Card
              className={`w-full max-w-md ${theme === "dark" ? "bg-white/10" : "bg-white/80"} backdrop-blur-lg ${theme === "dark" ? "border-white/20" : "border-gray-200"}`}
            >
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Get Started Today</CardTitle>
                <CardDescription className={`text-center ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
                  Join thousands of productive professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 transition-colors" asChild>
                    <Link href="/register">Create Free Account</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`text-lg ${theme === "dark" ? "border-white/20 text-white" : "border-gray-200 text-gray-900"} hover:bg-white/10 transition-colors`}
                    asChild
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"} hover:bg-white/10 transition-colors`}
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Clock className="animate-spin mr-2 h-5 w-5" />
                        Loading...
                      </span>
                    ) : (
                      "Try Demo"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className={`py-20 backdrop-blur-lg ${theme === "dark" ? "bg-white/5" : "bg-white/50"}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-center p-6 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-white/80"} backdrop-blur-lg border ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className={`text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Powerful Features for Modern Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<LineChart className="w-10 h-10" />}
              title="Advanced Analytics"
              description="Track your productivity trends with detailed insights and visualization tools"
              theme={theme}
            />
            <FeatureCard
              icon={<Target className="w-10 h-10" />}
              title="Goal Setting"
              description="Set and monitor personal and team goals with progress tracking"
              theme={theme}
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Time Management"
              description="Optimize your workflow with built-in time tracking and planning features"
              theme={theme}
            />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className={`py-20 backdrop-blur-lg ${theme === "dark" ? "bg-white/5" : "bg-white/50"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} theme={theme} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Boost Your Productivity?</h2>
            <p className={`text-xl max-w-2xl mx-auto ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
              Join thousands of professionals who have transformed their workflow with myown.
            </p>
            <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 transition-colors" asChild>
              <Link href="/register" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <ThemeSwitcher />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, theme }: { icon: React.ReactNode; title: string; description: string; theme: string | undefined }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-white/80"} backdrop-blur-lg border ${theme === "dark" ? "border-white/10" : "border-gray-200"} ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-white/95"} transition-all group`}
    >
      <div className="text-primary mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={theme === "dark" ? "text-gray-200" : "text-gray-600"}>{description}</p>
    </motion.div>
  )
}

function TestimonialCard({ name, role, content, rating, theme }: { name: string; role: string; content: string; rating: number; theme: string | undefined }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card
        className={`${theme === "dark" ? "bg-white/5" : "bg-white/80"} backdrop-blur-lg ${theme === "dark" ? "border-white/10" : "border-gray-200"} h-full flex flex-col justify-between ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-white/95"} transition-all`}
      >
        <CardContent className="p-6">
          <div className="flex mb-4">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className={`${theme === "dark" ? "text-gray-200" : "text-gray-600"} mb-4`}>{content}</p>
          <div className="mt-auto">
            <div className="font-semibold">{name}</div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>{role}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
