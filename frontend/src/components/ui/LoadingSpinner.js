import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  margin-left: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
`;

const LoadingSpinner = ({ size, text, showText = false }) => {
  return (
    <SpinnerContainer>
      <Spinner size={size} />
      {(showText || text) && <LoadingText>{text || 'Loading...'}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 