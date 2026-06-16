import InvestorApplicationForm from '@/components/sections/InvestorApplicationForm'

export const metadata = {
  title: 'Request Platform Access | Journey.Direct™',
  description:
    'Request access to Journey.Direct™, the operator-led self-storage investment platform. For accredited investors only.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-black px-5 md:px-8 lg:px-16 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">
              Apply for platform access
            </span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-warm-white leading-[0.95]">
            Request the platform overview.
          </h1>
          <p className="mx-auto mt-4 max-w-[500px] text-body font-light leading-[1.7] text-warm-white/60">
            Three quick questions and a brief profile. Accredited investors are
            routed directly to Jonah&apos;s calendar.
          </p>
        </div>
        <InvestorApplicationForm formSource="website-apply-page" />
      </div>
    </main>
  )
}
