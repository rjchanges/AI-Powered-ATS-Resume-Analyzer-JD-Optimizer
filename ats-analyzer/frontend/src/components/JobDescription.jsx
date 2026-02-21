import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 200px;
  width: 100%;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textDim};
  }
`;

export default function JobDescription({ value, onChange }) {
    return (
        <Container>
            <Label htmlFor="job-description">Job Description</Label>
            <TextArea
                id="job-description"
                placeholder="Paste the target job description here..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Container>
    );
}
