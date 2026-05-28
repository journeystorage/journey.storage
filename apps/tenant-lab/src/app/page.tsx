import { getProperties } from '@/lib/tenant-api'
import { toConsumerFacility } from '@/lib/consumer-data'
import { LocationSearch } from '@/components/LocationSearch'

export default async function SearchPage() {
  const data = await getProperties()
  const facilities = data.properties.map(toConsumerFacility)

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-20 lg:py-28">
        <p
          className="mb-5 font-bold uppercase"
          style={{ fontSize: '0.8125rem', letterSpacing: '0.15em', color: '#888680' }}
        >
          Self storage made simple
        </p>
        <h1
          className="max-w-2xl text-center font-black tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 0.95, color: '#181818' }}
        >
          Find the right{' '}
          <span style={{ color: '#E8622A' }}>storage unit</span>{' '}
          for you
        </h1>
        <p
          className="mt-5 max-w-md text-center"
          style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: '#888680' }}
        >
          Browse available units, compare sizes, and reserve online.
          Move in on your schedule.
        </p>

        <LocationSearch facilities={facilities} />
      </section>
    </div>
  )
}
