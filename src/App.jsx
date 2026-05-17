import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { I18nProvider } from './context/I18nProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { Layout } from './layouts/Layout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { EducationPage } from './pages/EducationPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TrajectoryPage } from './pages/TrajectoryPage'
import { VolunteeringPage } from './pages/VolunteeringPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <BrowserRouter basename={basename === '/' ? undefined : basename}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="trajectory" element={<TrajectoryPage />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="volunteering" element={<VolunteeringPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
