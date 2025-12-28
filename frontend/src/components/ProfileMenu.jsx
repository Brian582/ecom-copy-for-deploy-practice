import { useEffect, useRef } from 'react';
import './ProfileMenu.css';

export default function ProfileMenu({ isOpen, onClose, onLogout, triggerRef }){
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose && onClose();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    // focus first button after menu opens
    // const timer = setTimeout(() => {
    //   const first = ref.current?.querySelector('button');
    //   first?.focus();
    // }, 0);

    // // capture current trigger element to use in cleanup (ref may change)
    // const triggerEl = triggerRef?.current;

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      // clearTimeout(timer);
      // restore focus to trigger button when menu unmounts
      try {
        // triggerEl?.focus?.();
      } catch {
        // ignore
      }
    };
    
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="profile-menu" role="menu" aria-hidden={!isOpen} tabIndex={-1}>
      <div className="profile-header">Account</div>
      <ul className="profile-list">
        <li className="profile-item"><button onClick={onClose}>Profile</button></li>
        <li className="profile-item"><button onClick={onClose}>Orders</button></li>
        <li className="profile-item"><button className="logout" onClick={() => { onLogout && onLogout(); onClose && onClose(); }}>Log Out</button></li>
      </ul>
    </div>
  )
}
