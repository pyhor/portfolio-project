import { groupTimelineByYear } from '../lib/timeline'

export function YearTimeline({ items, idPrefix, renderItem }) {
  return <div className="timeline-years">
    {groupTimelineByYear(items).map(group => <section className="timeline-year" key={group.year} aria-labelledby={`${idPrefix}-${group.year}`}>
      <h2 className="timeline-year__label timeline-reveal" id={`${idPrefix}-${group.year}`}><time dateTime={group.year}>{group.year}</time></h2>
      <ol className="timeline-track">{group.items.map(item => <li className="timeline-node timeline-reveal" key={item.id}>
        <span className="timeline-node__dot" aria-hidden="true" />
        {renderItem(item)}
      </li>)}</ol>
    </section>)}
  </div>
}
