import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

type SuccessPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  onAnimationComplete?: () => void;
};

const popupStyle = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)'
  },
  card: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '24rem',
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'visible' as const,
    paddingTop: '4.5rem',
    paddingBottom: '3rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center' as const,
    minHeight: '200px'
  },
  successCircle: {
    position: 'absolute' as const,
    top: '-3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '5rem',
    height: '5rem',
    backgroundColor: '#10B981',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.75rem',
    marginTop: '0.5rem',
    fontFamily: 'Poppins, sans-serif',
    lineHeight: '1.3'
  },
  message: {
    color: '#6B7280',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
  }
};

const SuccessPopup = ({ isVisible, onClose }: SuccessPopupProps) => {
  useEffect(() => {
    console.log('SuccessPopup isVisible:', isVisible);
    if (isVisible) {
      console.log('✅ Success popup is now visible!');
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={popupStyle.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with blur */}
          <motion.div 
            style={popupStyle.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Popup Card */}
          <motion.div
            style={popupStyle.card}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 400
            }}
          >
            {/* Success Circle */}
            <div style={popupStyle.successCircle}>
              <Check style={{ width: '2.5rem', height: '2.5rem', color: 'white', strokeWidth: 3 }} />
            </div>
            
            <h2 style={popupStyle.title}>
              Order Placed Successfully!
            </h2>
            <p style={popupStyle.message}>
              Your order will be delivered within 25 minutes. Enjoy your food!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessPopup;
