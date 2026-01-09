import { useEffect, useRef } from 'react';
import '../styles/ProfileMenu.css';

export default function ProfileMenu({ isOpen, onClose, onLogout, triggerRef }){
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      const target = e.target || e.srcElement;
      const clickedInside = ref.current && (ref.current === target || ref.current.contains(target));
      const clickedTrigger = triggerRef?.current && (triggerRef.current === target || triggerRef.current.contains(target));
      if (!clickedInside && !clickedTrigger) {
        onClose && onClose();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose && onClose();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="profile-menu" role="menu" aria-hidden={!isOpen} tabIndex={-1} >
      <div className="profile-header">Account</div>
      <ul className="profile-list">
        <li className="profile-item"><button onClick={() => { /* keep menu open for now */ }}>Profile</button></li>
        <li className="profile-item"><button onClick={() => { /* keep menu open for now */ }}>Orders</button></li>
        <li className="profile-item"><button className="logout" onClick={() => { onLogout && onLogout(); onClose && onClose(); }}>Log Out</button></li>
      </ul>
    </div>
  )
}
