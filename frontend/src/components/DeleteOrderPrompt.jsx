import "../styles/DeleteOrderPrompt.css";

export default function DeleteOrderPrompt({ isOpen, onClose, onConfirm, message, title = "Confirm" }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="confirm-overlay"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="confirm-modal">
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="confirm-footer">
          <button
            className="confirm-btn cancel-btn"
            onClick={handleCancel}
            type="button"
          >
            No
          </button>
          <button
            className="confirm-btn confirm-btn-primary"
            onClick={handleConfirm}
            type="button"
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
}