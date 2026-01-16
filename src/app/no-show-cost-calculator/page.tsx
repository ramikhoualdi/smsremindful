'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'

export default function NoShowCostCalculatorPage() {
  const [appointmentsPerWeek, setAppointmentsPerWeek] = useState(50)
  const [noShowRate, setNoShowRate] = useState(15)
  const [appointmentValue, setAppointmentValue] = useState(200)
  const [isCalculated, setIsCalculated] = useState(false)
  const [animatedSavings, setAnimatedSavings] = useState(0)

  // Calculate slider fill percentages
  const getSliderBackground = (value: number, min: number, max: number, color: string = '#171717') => {
    const percentage = ((value - min) / (max - min)) * 100
    return `linear-gradient(to right, ${color} ${percentage}%, #e5e5e5 ${percentage}%)`
  }

  // Calculations
  const weeklyNoShows = Math.round(appointmentsPerWeek * (noShowRate / 100))
  const monthlyNoShows = weeklyNoShows * 4
  const yearlyNoShows = weeklyNoShows * 52

  const monthlyLoss = monthlyNoShows * appointmentValue
  const yearlyLoss = yearlyNoShows * appointmentValue

  // SMS reminders typically reduce no-shows by 30-50% (using conservative 35%)
  const reductionRate = 0.35
  const monthlySavings = Math.round(monthlyLoss * reductionRate)
  const yearlySavings = Math.round(yearlyLoss * reductionRate)

  // SMS Remindful pricing based on weekly appointments
  const monthlyPlanCost = appointmentsPerWeek <= 75 ? 49 : appointmentsPerWeek <= 200 ? 99 : 149
  const yearlyPlanCost = monthlyPlanCost * 12
  const netYearlySavings = yearlySavings - yearlyPlanCost
  const roi = yearlyPlanCost > 0 ? Math.round((netYearlySavings / yearlyPlanCost) * 100) : 0

  // Animate savings number (yearly)
  useEffect(() => {
    if (isCalculated) {
      let start = 0
      const end = yearlySavings
      const duration = 1500
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setAnimatedSavings(end)
          clearInterval(timer)
        } else {
          setAnimatedSavings(Math.round(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isCalculated, yearlySavings])

  const handleCalculate = () => {
    setIsCalculated(true)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* SEO-optimized Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Free Calculator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            What Are No-Shows{' '}
            <span className="text-green-600">Really Costing You?</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Calculate how much revenue your dental practice loses to patient no-shows and see your potential savings with automated SMS reminders.
          </p>
        </header>

        {/* Calculator Card */}
        <section aria-label="No-show cost calculator" className="bg-card border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          {/* Input: Appointments per week */}
          <div className="mb-8">
            <label className="flex justify-between items-center mb-4 text-sm font-medium text-foreground">
              <span>Weekly patient appointments</span>
              <span className="bg-muted px-3 py-1.5 rounded-lg font-semibold tabular-nums min-w-[60px] text-center">
                {appointmentsPerWeek}
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={appointmentsPerWeek}
              onChange={(e) => {
                setAppointmentsPerWeek(Number(e.target.value))
                setIsCalculated(false)
              }}
              className="w-full h-2"
              style={{ background: getSliderBackground(appointmentsPerWeek, 10, 200) }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>10</span>
              <span>200</span>
            </div>
          </div>

          {/* Input: No-show rate */}
          <div className="mb-8">
            <label className="flex justify-between items-center mb-4 text-sm font-medium text-foreground">
              <span>Current no-show rate</span>
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-semibold tabular-nums min-w-[60px] text-center">
                {noShowRate}%
              </span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={noShowRate}
              onChange={(e) => {
                setNoShowRate(Number(e.target.value))
                setIsCalculated(false)
              }}
              className="w-full h-2 slider-red"
              style={{ background: getSliderBackground(noShowRate, 5, 40, '#dc2626') }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>5%</span>
              <span>40%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Industry average: 10-20% for dental practices
            </p>
          </div>

          {/* Input: Appointment value */}
          <div className="mb-8">
            <label className="flex justify-between items-center mb-4 text-sm font-medium text-foreground">
              <span>Average appointment value</span>
              <span className="bg-muted px-3 py-1.5 rounded-lg font-semibold tabular-nums min-w-[80px] text-center">
                {formatCurrency(appointmentValue)}
              </span>
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={appointmentValue}
              onChange={(e) => {
                setAppointmentValue(Number(e.target.value))
                setIsCalculated(false)
              }}
              className="w-full h-2"
              style={{ background: getSliderBackground(appointmentValue, 50, 500) }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$50</span>
              <span>$500</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average dental appointment: $150-$300
            </p>
          </div>

          {/* Calculate Button */}
          {!isCalculated && (
            <button
              onClick={handleCalculate}
              className="w-full py-4 px-6 text-base font-semibold text-primary-foreground bg-primary rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            >
              Calculate My Savings →
            </button>
          )}
        </section>

        {/* Results */}
        {isCalculated && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Loss Card */}
            <section aria-label="Current revenue loss" className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 mb-4 text-center">
              <p className="text-sm font-medium text-red-700 uppercase tracking-wide mb-3">
                You&apos;re Losing
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-red-600 mb-2">
                {formatCurrency(yearlyLoss)}
                <span className="text-xl font-normal text-red-500">/year</span>
              </p>
              <div className="w-16 h-px bg-red-300 mx-auto my-4" />
              <p className="text-sm text-red-600/80">
                {monthlyNoShows} no-shows/month × {formatCurrency(appointmentValue)} = <span className="font-semibold">{formatCurrency(monthlyLoss)}/month</span>
              </p>
            </section>

            {/* Savings Card */}
            <section aria-label="Potential savings with SMS reminders" className="bg-green-50 border border-green-300 rounded-xl p-6 sm:p-8 mb-4 text-center">
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide mb-3">
                With SMS Reminders
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-green-600 mb-1">
                +{formatCurrency(animatedSavings)}
                <span className="text-xl font-normal text-green-500">/year</span>
              </p>
              <p className="text-green-700/70 text-sm mb-6">
                potential recovery*
              </p>
              <div className="w-12 h-px bg-green-300 mx-auto mb-6" />
              <p className="text-green-800 text-lg">
                For just <span className="font-bold">{formatCurrency(monthlyPlanCost)}/mo</span>, recover <span className="font-bold">{formatCurrency(monthlySavings)}/mo</span>
              </p>
              <p className="text-green-700 mt-1">
                That&apos;s a <span className="font-bold">{Math.round(monthlySavings / monthlyPlanCost)}x return</span> on your investment
              </p>
              <p className="text-xs text-green-600/60 mt-6">
                *Based on 35% reduction (studies show 30-50% improvement)
              </p>
            </section>

            {/* Comparison */}
            <section aria-label="Why SMS Remindful" className="bg-card border rounded-xl p-6 mb-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Why Pay for Features You Don&apos;t Need?
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-foreground">Other tools</span>
                    <span className="text-foreground font-semibold">$300-500/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bundle VoIP, reviews, marketing, CRM, and dozens of features your practice may never use.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-green-700">SMS Remindful</span>
                    <span className="text-green-700 font-bold">${monthlyPlanCost}/mo</span>
                  </div>
                  <p className="text-sm text-green-700/80">
                    Appointment reminders via SMS. Syncs with Google Calendar. Simple, effective, done.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section aria-label="Start free trial" className="bg-foreground text-background rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Start Recovering Lost Revenue
              </h2>
              <p className="text-background/70 mb-6">
                7-day free trial • 20 SMS included • No credit card required
              </p>

              <Link
                href="/sign-up"
                className="inline-block px-8 py-4 text-base font-semibold text-foreground bg-background rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Start Free Trial →
              </Link>

              <p className="mt-4 text-sm text-background/50">
                Setup in under 5 minutes. Works with Google Calendar.
              </p>
            </section>

          </div>
        )}

        {/* SEO Content */}
        <article className="mt-12 pt-8 border-t space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              How Patient No-Shows Impact Your Dental Practice
            </h2>
            <p className="leading-relaxed mb-3">
              Patient no-shows are one of the biggest challenges facing dental practices today.
              The average dental practice experiences a 10-20% no-show rate, with each missed
              appointment costing $150-$300 in lost revenue. For a practice seeing 50 patients
              per week with a 15% no-show rate, this translates to over $60,000 in lost revenue
              annually.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/blog/cost-of-no-shows-dental-practices"
                className="text-foreground font-medium hover:underline"
              >
                Learn more →
              </Link>
              <a
                href="https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-020-05590-y"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Research: BMC Health Services ↗
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Why SMS Reminders Reduce No-Shows
            </h2>
            <p className="leading-relaxed mb-3">
              Text messages have a 98% open rate compared to just 20% for emails and 10% for
              phone calls. Studies consistently show that SMS appointment reminders can reduce
              no-show rates by 30-50%. Unlike phone calls, SMS reminders don&apos;t interrupt
              patients during work or busy moments, leading to higher engagement and better
              appointment attendance.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/blog/sms-vs-email-vs-phone-reminders"
                className="text-foreground font-medium hover:underline"
              >
                Learn more →
              </Link>
              <a
                href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007458.pub3/full"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Research: Cochrane Reviews ↗
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Proven Strategies to Reduce No-Shows
            </h2>
            <p className="leading-relaxed mb-3">
              The most effective approach combines automated SMS reminders with easy rescheduling
              options and confirmation requests. Research shows sending reminders 1 week before,
              1 day before, and the morning of appointments yields the best results. These
              strategies alone can reduce no-shows by 30-50%.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/blog/how-to-reduce-dental-no-shows"
                className="text-foreground font-medium hover:underline"
              >
                Learn more →
              </Link>
              <a
                href="https://www.nature.com/articles/sj.bdj.2016.288"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Research: British Dental Journal ↗
              </a>
            </div>
          </section>
        </article>

        <Footer showAbout />
      </div>
    </main>
  )
}
