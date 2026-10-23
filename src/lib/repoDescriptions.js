export const REPO_DESCRIPTION_KEYS = {
  'hotel-website-2023': 'repo_hotel_desc',
  'cinema-mgmt-system-2020': 'repo_cinema_desc',
  'vet-mgmt-system-2024': 'repo_vet_desc',
  'portfolio-project': 'repo_portfolio_desc',
  pyhor: 'repo_profile_desc',
  'testing-tanstack-app': 'repo_tanstack_desc',
  'JomGo-web': 'bsa_jomgo_desc',
}

export function repoDescription(repo, t, language) {
  const key = REPO_DESCRIPTION_KEYS[repo.name]
  if (key) return t(key)
  return language === 'en' && repo.description ? repo.description : t('repo_fallback_desc')
}
