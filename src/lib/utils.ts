import { SCROLL_OFFSET } from './constants'

/**
 * Smooth-scroll to a section by ID, accounting for the sticky navbar offset.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET

  window.scrollTo({ top, behavior: 'smooth' })
}

export function getSizeAnalogy(sqft: number): { analogy: string; items: string[] } {
  if (sqft <= 25) return {
    analogy: 'Small closet',
    items: ['Boxes & seasonal items', 'Small furniture', 'Sports equipment', 'Holiday decorations'],
  }
  if (sqft <= 50) return {
    analogy: 'Walk-in closet',
    items: ['Queen mattress set', 'Dresser & nightstand', 'Medium boxes', 'Bicycle & gear'],
  }
  if (sqft <= 75) return {
    analogy: 'Large closet',
    items: ['Studio apartment contents', 'Sofa & dining set', 'Appliances', 'Multiple boxes'],
  }
  if (sqft <= 100) return {
    analogy: 'Half a garage',
    items: ['1-bedroom apartment', 'Full living room set', 'Washer & dryer', 'Patio furniture'],
  }
  if (sqft <= 150) return {
    analogy: 'One-car garage',
    items: ['2-bedroom apartment', 'King bedroom set', 'Large appliances', 'Business inventory'],
  }
  if (sqft <= 200) return {
    analogy: 'Standard garage',
    items: ['3-bedroom house', 'Multiple room sets', 'Vehicle storage', 'Commercial equipment'],
  }
  if (sqft <= 300) return {
    analogy: 'Double garage',
    items: ['4-bedroom house', 'Full household', 'Multiple vehicles', 'Large business inventory'],
  }
  return {
    analogy: 'Warehouse space',
    items: ['5+ bedroom house', 'Commercial storage', 'Fleet vehicles', 'Industrial equipment'],
  }
}
