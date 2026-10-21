import { FEATURED_PROJECTS } from './featuredProjects'

// Only documented work. Text-led previews are not fabricated product screenshots.
export const SHOWCASE_PROJECTS = [
  ...FEATURED_PROJECTS.map((project, index) => ({
    ...project, roleKey: `ref_${index ? 'cinema' : 'hotel'}_role`,
    problemKey: `ref_${index ? 'cinema' : 'hotel'}_problem`,
    statusKey: index ? 'showcase_source_available' : 'showcase_live_available',
    categoryKey: index ? 'showcase_system' : 'showcase_interface',
  })),
  {
    id: 'vet-mgmt-system-2024', titleKey: 'showcase_vet_title',
    metaKey: 'traj_code_3_period', descKey: 'showcase_vet_desc',
    roleKey: 'showcase_vet_role', problemKey: 'showcase_vet_problem',
    contribKey: 'traj_code_3_note', techKey: 'traj_code_3_tech',
    statusKey: 'showcase_source_available', categoryKey: 'showcase_system',
    githubUrl: 'https://github.com/pyhor/vet-mgmt-system-2024',
  },
  {
    id: 'asean-data-2024', titleKey: 'proj_asean_title',
    metaKey: 'proj_asean_meta', descKey: 'proj_asean_desc',
    roleKey: 'showcase_asean_role', problemKey: 'showcase_asean_problem',
    contribKey: 'proj_asean_c1', techKey: 'proj_asean_tool',
    statusKey: 'showcase_presentation_available', categoryKey: 'showcase_research',
    liveUrl: 'https://aseandata2024.my.canva.site/',
  },
]
