import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const Input = styled.input`
  padding: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin-right: 0.5rem;
  font-weight: 600;
  width: 350px;
  box-shadow: 0 4px 6px rgba(82, 82, 82, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease-in-out;
  &:focus {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
    outline: 2px solid #007bff;
  }
`;

const Button = styled.button<{ isLoading?: boolean }>`
  width: 70px;
  height: 40px;
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  position: relative;
  &:hover {
    background-color: #0056b3;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  &:active {
    background-color: #004494;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  &:disabled {
    background-color: #007bff;
    cursor: not-allowed;
  }
  ${({ isLoading }) =>
    isLoading &&
    `
    color: transparent;
    pointer-events: none;
  `}
`;

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface AddStockInputProps {
  handleAddStock: (value: string) => void;
  isLoading?: boolean;
}

export const AddStockInput: React.FC<AddStockInputProps> = ({ handleAddStock, isLoading }) => {
  
  const [stockSymbol, setStockSymbol] = useState('');

  const onAddStockClick = () => {
    if (stockSymbol) {
      handleAddStock(stockSymbol);
    }
  }
  
  return (
    <Container>
      <Input
        type="text"
        placeholder="Enter a stock symbol (e.g. AAPL)"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value)}
      />
      <Button onClick={onAddStockClick} isLoading={isLoading} disabled={isLoading}>
        {isLoading ? <Spinner /> : 'Add'}
      </Button>
    </Container>
  )
}