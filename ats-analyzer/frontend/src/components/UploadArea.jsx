import React, { useCallback } from 'react';
import styled from 'styled-components';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';

const DropZone = styled.div`
  border: 2px dashed ${({ theme, $isDragActive }) => ($isDragActive ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 3rem 2rem;
  text-align: center;
  background-color: ${({ theme, $isDragActive }) => ($isDragActive ? 'rgba(30, 144, 255, 0.05)' : theme.colors.surface)};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(30, 144, 255, 0.05);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme, $hasFile }) => ($hasFile ? theme.colors.success : theme.colors.primary)};
  margin-bottom: 1rem;
`;

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const SubText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDim};
`;

const FileInput = styled.input`
  display: none;
`;

export default function UploadArea({ file, setFile }) {
    const [isDragActive, setIsDragActive] = React.useState(false);
    const inputRef = React.useRef(null);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
            } else {
                alert('Please upload a valid PDF file.');
            }
        }
    }, [setFile]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('Please upload a valid PDF file.');
            }
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <DropZone
            $isDragActive={isDragActive}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <FileInput
                type="file"
                accept="application/pdf"
                ref={inputRef}
                onChange={handleChange}
            />
            <IconWrapper $hasFile={!!file}>
                {file ? <FaFilePdf /> : <FaCloudUploadAlt />}
            </IconWrapper>
            <Text>
                {file ? file.name : 'Drag & drop your resume here'}
            </Text>
            {!file && <SubText>supports PDF up to 5MB</SubText>}
        </DropZone>
    );
}
