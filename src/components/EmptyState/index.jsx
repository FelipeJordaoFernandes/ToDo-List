import './empty-state.style.css';
export function EmptyState() {
  return <div className="empty-state">
    <svg width="72" height="80" viewBox="0 0 72 80" fill="none" aria-hidden="true"><rect x="14" y="8" width="47" height="63" rx="8" fill="#e7eee3" transform="rotate(8 14 8)" /><rect x="10" y="5" width="47" height="63" rx="8" fill="#fcfcf7" stroke="#839d80" strokeWidth="1.5" /><path d="m21 26 3 3 6-7M35 26h11M21 40h25M21 51h18" stroke="#245f3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M25 3h17v8H25z" fill="#c5d8bd" stroke="#839d80" strokeLinejoin="round" /></svg>
    <h2>Um dia cheio de possibilidades.</h2>
    <p>Comece com uma tarefa.<br />O resto, um passo de cada vez.</p>
  </div>;
}
