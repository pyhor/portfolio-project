import { t } from './i18n.js'

export function setupCounter(element) {
  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.textContent = t('counter_value').replace('{{count}}', String(counter))
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  window.addEventListener('languageChanged', () => setCounter(counter))
  setCounter(0)
}
