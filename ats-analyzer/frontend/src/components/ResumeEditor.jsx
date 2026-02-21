import React, { useState } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDim};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme, active }) => active ? theme.colors.success : theme.colors.textDim};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddButton = styled.button`
  background: rgba(59, 130, 246, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default function ResumeEditor({ data, onChange }) {
    if (!data) return null;

    // Helper to initialize visibility state if not present
    const isVisible = (section) => data.visibility ? data.visibility[section] !== false : true;

    const handleVisibilityToggle = (section) => {
        const currentVisibility = data.visibility || {};
        onChange({
            ...data,
            visibility: {
                ...currentVisibility,
                [section]: !isVisible(section)
            }
        });
    };

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim());
        handleChange('skills', skillsArray);
    };

    const handleReferencesChange = (e) => {
        const refsArray = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
        handleChange('references', refsArray);
    };

    // Generic Array Handlers
    const handleArrayChange = (arrayName, index, field, value) => {
        const newArray = [...(data[arrayName] || [])];
        newArray[index] = { ...newArray[index], [field]: value };
        handleChange(arrayName, newArray);
    };

    const handleAddArrayItem = (arrayName, emptyTemplate) => {
        const newArray = [...(data[arrayName] || []), emptyTemplate];
        handleChange(arrayName, newArray);
    };

    const handleRemoveArrayItem = (arrayName, index) => {
        const newArray = [...(data[arrayName] || [])];
        newArray.splice(index, 1);
        handleChange(arrayName, newArray);
    };

    const renderVisibilityToggle = (section, label) => (
        <ToggleButton
            active={isVisible(section)}
            onClick={() => handleVisibilityToggle(section)}
            title={`Toggle ${label} visibility`}
        >
            {isVisible(section) ? '👁️ Shown' : '🚫 Hidden'}
        </ToggleButton>
    );

    return (
        <EditorContainer>
            <SectionHeader>
                <h3>Live Editor</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Edit & Toggle Sections</span>
            </SectionHeader>

            {/* Personal Details */}
            <SectionHeader>
                <h3>Personal info</h3>
                {renderVisibilityToggle('personal', 'Personal Details')}
            </SectionHeader>
            {isVisible('personal') && (
                <>
                    <FormGroup>
                        <Label>Full Name</Label>
                        <Input
                            value={data.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Jane Doe"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Professional Title</Label>
                        <Input
                            value={data.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g. Professional Accountant"
                        />
                    </FormGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <FormGroup>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="e.g. +1 234 567 890"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                value={data.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="e.g. hello@reallygreatsite.com"
                            />
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Label>Location</Label>
                        <Input
                            value={data.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="e.g. 123 Anywhere St., Any City"
                        />
                    </FormGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <FormGroup>
                            <Label>LinkedIn URL</Label>
                            <Input
                                value={data.linkedin || ''}
                                onChange={(e) => handleChange('linkedin', e.target.value)}
                                placeholder="e.g. linkedin.com/in/username"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>GitHub URL</Label>
                            <Input
                                value={data.github || ''}
                                onChange={(e) => handleChange('github', e.target.value)}
                                placeholder="e.g. github.com/username"
                            />
                        </FormGroup>
                    </div>
                </>
            )}

            {/* Objective */}
            <SectionHeader>
                <h3>Objective</h3>
                {renderVisibilityToggle('objective', 'Objective')}
            </SectionHeader>
            {isVisible('objective') && (
                <FormGroup>
                    <TextArea
                        value={data.objective || ''}
                        onChange={(e) => handleChange('objective', e.target.value)}
                        placeholder="e.g. Seeking a challenging role..."
                    />
                </FormGroup>
            )}

            {/* Summary */}
            <SectionHeader>
                <h3>Professional Summary</h3>
                {renderVisibilityToggle('summary', 'Summary')}
            </SectionHeader>
            {isVisible('summary') && (
                <FormGroup>
                    <TextArea
                        value={data.summary || ''}
                        onChange={(e) => handleChange('summary', e.target.value)}
                        placeholder="Brief overview of your career and skills..."
                    />
                </FormGroup>
            )}

            {/* Skills */}
            <SectionHeader>
                <h3>Skills</h3>
                {renderVisibilityToggle('skills', 'Skills')}
            </SectionHeader>
            {isVisible('skills') && (
                <FormGroup>
                    <Label>Comma separated</Label>
                    <Input
                        value={(data.skills || []).join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="React, Node.js, Python..."
                    />
                </FormGroup>
            )}

            {/* Experience */}
            <SectionHeader>
                <h3>Experience</h3>
                {renderVisibilityToggle('experience', 'Experience')}
            </SectionHeader>
            {isVisible('experience') && (
                <>
                    {(data.experience || []).map((exp, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RemoveButton onClick={() => handleRemoveArrayItem('experience', index)}>Remove</RemoveButton>
                            </div>
                            <FormGroup>
                                <Label>Job Title</Label>
                                <Input value={exp.title || ''} onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)} />
                            </FormGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <Label>Company</Label>
                                    <Input value={exp.company || ''} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Dates</Label>
                                    <Input value={exp.dates || ''} onChange={(e) => handleArrayChange('experience', index, 'dates', e.target.value)} />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Label>Description</Label>
                                <TextArea
                                    value={exp.description || ''}
                                    onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                                    style={{ minHeight: '80px' }}
                                />
                            </FormGroup>
                        </div>
                    ))}
                    <AddButton onClick={() => handleAddArrayItem('experience', { title: '', company: '', dates: '', description: '' })}>
                        + Add Experience
                    </AddButton>
                </>
            )}

            {/* Education */}
            <SectionHeader>
                <h3>Education</h3>
                {renderVisibilityToggle('education', 'Education')}
            </SectionHeader>
            {isVisible('education') && (
                <>
                    {(data.education || []).map((edu, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RemoveButton onClick={() => handleRemoveArrayItem('education', index)}>Remove</RemoveButton>
                            </div>
                            <FormGroup>
                                <Label>Degree / Certificate</Label>
                                <Input value={edu.degree || ''} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                            </FormGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <Label>School / University</Label>
                                    <Input value={edu.school || ''} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Dates</Label>
                                    <Input value={edu.dates || ''} onChange={(e) => handleArrayChange('education', index, 'dates', e.target.value)} />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Label>Details (Optional)</Label>
                                <TextArea
                                    value={edu.details || ''}
                                    onChange={(e) => handleArrayChange('education', index, 'details', e.target.value)}
                                    style={{ minHeight: '60px' }}
                                />
                            </FormGroup>
                        </div>
                    ))}
                    <AddButton onClick={() => handleAddArrayItem('education', { degree: '', school: '', dates: '', details: '' })}>
                        + Add Education
                    </AddButton>
                </>
            )}

            {/* Projects */}
            <SectionHeader>
                <h3>Projects</h3>
                {renderVisibilityToggle('projects', 'Projects')}
            </SectionHeader>
            {isVisible('projects') && (
                <>
                    {(data.projects || []).map((proj, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RemoveButton onClick={() => handleRemoveArrayItem('projects', index)}>Remove</RemoveButton>
                            </div>
                            <FormGroup>
                                <Label>Project Name</Label>
                                <Input value={proj.name || ''} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Technologies (comma separated)</Label>
                                <Input
                                    value={(proj.technologies || []).join(', ')}
                                    onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <TextArea
                                    value={proj.description || ''}
                                    onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                    style={{ minHeight: '60px' }}
                                />
                            </FormGroup>
                        </div>
                    ))}
                    <AddButton onClick={() => handleAddArrayItem('projects', { name: '', description: '', technologies: [] })}>
                        + Add Project
                    </AddButton>
                </>
            )}

            {/* References */}
            <SectionHeader>
                <h3>References</h3>
                {renderVisibilityToggle('references', 'References')}
            </SectionHeader>
            {isVisible('references') && (
                <FormGroup>
                    <Label>One per line</Label>
                    <TextArea
                        value={(data.references || []).join('\n')}
                        onChange={handleReferencesChange}
                        placeholder="John Doe, Manager - jdoe@example.com&#10;Available upon request"
                    />
                </FormGroup>
            )}

            {/* Cover Letter */}
            <SectionHeader>
                <h3>Cover Letter</h3>
                {renderVisibilityToggle('cover_letter', 'Cover Letter')}
            </SectionHeader>
            {isVisible('cover_letter') && (
                <FormGroup>
                    <TextArea
                        value={data.cover_letter || ''}
                        onChange={(e) => handleChange('cover_letter', e.target.value)}
                        placeholder="Dear Hiring Manager..."
                        style={{ minHeight: '200px' }}
                    />
                </FormGroup>
            )}

        </EditorContainer>
    );
}
