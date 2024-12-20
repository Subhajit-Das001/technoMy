import React from 'react';
import './ConfirmationModal.css';




const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm End of Exam</h3>
                <p>Are you sure you want to end the exam? You cannot alter answers later</p>
                <div className="modal-actions">
                    <button className="modal-btn"  id='btn1' onClick={onConfirm}>Yes</button>
                    <button className="modal-btn" id='btn2' onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;