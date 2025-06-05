import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  max-width: 500px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background: #0056b3;
      border-color: #0056b3;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: white;
    color: #6c757d;
    border-color: #ced4da;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const Illustration = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  opacity: 0.3;
`;

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/dashboard');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Illustration>🔍</Illustration>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Message>
        Sorry, we couldn't find the page you're looking for. 
        The page might have been moved, deleted, or you might have mistyped the URL.
      </Message>
      <ButtonGroup>
        <Button className="primary" onClick={goHome}>
          <FiHome />
          Go to Dashboard
        </Button>
        <Button className="secondary" onClick={goBack}>
          <FiArrowLeft />
          Go Back
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default NotFound; 