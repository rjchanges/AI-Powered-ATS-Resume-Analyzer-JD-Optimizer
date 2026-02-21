import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaHatWizard, FaSpinner } from 'react-icons/fa';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  margin-top: 1.5rem;

  &:hover:not(:disabled) {
    background-color: #0073e6;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textDim};
    cursor: not-allowed;
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1.5s linear infinite;
`;

export default function AnalyzeButton({ onClick, isLoading, disabled }) {
    return (
        <Button onClick={onClick} disabled={disabled || isLoading}>
            {isLoading ? (
                <>
                    <SpinnerIcon /> Analyzing...
                </>
            ) : (
                <>
                    <FaHatWizard /> Analyze Resume
                </>
            )}
        </Button>
    );
}
