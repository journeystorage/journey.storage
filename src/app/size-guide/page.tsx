import { permanentRedirect } from 'next/navigation'

// The standalone /size-guide page was retired — the size guide is now a modal
// that opens from the "Size Guide" link in the nav across the site. Permanently
// redirect the old URL to the homepage so bookmarks and search links don't 404.
export default function SizeGuideRedirect() {
  permanentRedirect('/')
}
