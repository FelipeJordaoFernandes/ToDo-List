import './dialog.style.css';
import { useEffect, useRef } from 'react';
import { IconClose } from '../icons';
export function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) { dialog.showModal(); dialog.querySelector('input')?.focus(); }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);
  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <dialog ref={dialogRef} className="dialog" aria-labelledby="dialog-title" onClose={onClose} onKeyDown={handleKeyDown}>
    <div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button type="button" onClick={onClose} className="btn" aria-label="Fechar formulário"><IconClose /></button></div>
    {children}
  </dialog>;
}
