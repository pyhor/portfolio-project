import { PageShell } from '../components/PageShell'
import { ContactSection } from '../components/ContactSection'

export function ContactPage() {
  return (
    <PageShell className="contact-page">
      <ContactSection id="contact-page" headingAs="h1" />
    </PageShell>
  )
}
