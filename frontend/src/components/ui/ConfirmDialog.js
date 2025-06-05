import React from 'react';
import styled from 'styled-components';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Dialog = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 90%;
  margin: 1rem;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => 
    props.variant === 'danger' ? '#fee' : 
    props.variant === 'warning' ? '#fff3cd' : 
    '#e7f3ff'
  };
  color: ${props => 
    props.variant === 'danger' ? '#dc3545' : 
    props.variant === 'warning' ? '#856404' : 
    '#007bff'
  };
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #495057;
  }
`;

const Content = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

const Message = styled.p`
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  &.secondary {
    background: white;
    color: #6c757d;
    border-color: #ced4da;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }
  }

  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background: #0056b3;
      border-color: #0056b3;
    }
  }

  &.danger {
    background: #dc3545;
    color: white;
    border-color: #dc3545;

    &:hover {
      background: #c82333;
      border-color: #c82333;
    }
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  icon = null
}) => {
  const getIcon = () => {
    if (icon) return icon;
    if (confirmVariant === 'danger') return <FiAlertTriangle size={20} />;
    return null;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
      if (e.key === 'Enter') {
        onConfirm();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onConfirm]);

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <Header>
          <HeaderContent>
            {getIcon() && (
              <IconWrapper variant={confirmVariant}>
                {getIcon()}
              </IconWrapper>
            )}
            <Title id="dialog-title">{title}</Title>
          </HeaderContent>
          <CloseButton onClick={onCancel} aria-label="Close dialog">
            <FiX size={18} />
          </CloseButton>
        </Header>
        
        <Content>
          <Message id="dialog-description">{message}</Message>
          <Actions>
            <Button className="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button className={confirmVariant} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </Actions>
        </Content>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmDialog; 