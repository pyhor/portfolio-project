import { useI18n } from '../context/I18nProvider'

export function ProjectBusinessValue({ project }) {
  const { t } = useI18n()
  return <aside className="project-business-value">
    <p className="eyebrow">{t('project_business_value_label')}</p>
    <p><mark>{t(`project_${project}_business`)}</mark></p>
    <p><mark>{t(`home_${project}_benefit`)}</mark></p>
  </aside>
}
