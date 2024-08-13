import React from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    // Handle keydown events to close the modal on 'Escape' key press
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent event propagation to the modal content
    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
            onClick={onClose} // Clicking outside the modal closes it
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-lg relative"
                onClick={handleContentClick} // Prevent clicking inside content from closing the modal
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label="Close Modal"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};
