import React from 'react';
import styled from 'styled-components';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

// Shared container constraint for the A4-like preview
export const PreviewContainer = styled.div`
  background: white;
  color: #111827; // slate-900
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  min-height: 1100px; // A4 approx
  box-sizing: border-box;
`;

// Helper to check visibility
const isVisible = (data, section) => data?.visibility ? data.visibility[section] !== false : true;


/* =========================================
   Professional Template
   ========================================= */
const ProfWrapper = styled(PreviewContainer)`
  padding: 3rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #1a1a1a;
`;

const ProfHeader = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;

  h1 {
    margin: 0;
    font-size: 30pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #111;
  }
  
  h2 {
    margin: 0.25rem 0 0.5rem 0;
    font-size: 14pt;
    font-weight: 400;
    color: #444;
    letter-spacing: 1px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 9.5pt;
  color: #555;
  margin-bottom: 0.5rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const ProfSectionTitle = styled.h2`
  font-size: 11pt;
  font-weight: 800;
  text-transform: uppercase;
  border-top: 1px solid #111;
  margin-top: 1rem;
  padding-top: 0.75rem;
  margin-bottom: 0.6rem;
  color: #111;
  letter-spacing: 1.5px;
`;

const SkillsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem 1rem;
  font-size: 10pt;
  color: #333;
  list-style-type: disc;
  margin: 0;
  padding-left: 1.25rem;
  
  li {
    margin-bottom: 0.25rem;
    line-height: 1.4;
  }
`;

export function ProfessionalTemplate({ data }) {
    if (!data) return null;
    return (
        <ProfWrapper>
            {isVisible(data, 'personal') && (
                <ProfHeader>
                    <h1>{data.name || 'Your Name'}</h1>
                    {data.title && <h2>{data.title}</h2>}
                    <ContactInfo>
                        {data.phone && <span><FaPhoneAlt size={10} /> {data.phone}</span>}
                        {data.email && <span><FaEnvelope size={10} /> {data.email}</span>}
                        {data.location && <span><FaMapMarkerAlt size={10} /> {data.location}</span>}
                        {data.linkedin && <span><FaLinkedin size={10} /> {data.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>}
                        {data.github && <span><FaGithub size={10} /> {data.github.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>}
                    </ContactInfo>
                </ProfHeader>
            )}

            {isVisible(data, 'summary') && data.summary && (
                <>
                    <ProfSectionTitle>About Me</ProfSectionTitle>
                    <div style={{ textAlign: 'justify', marginBottom: '1rem', fontSize: '10pt', lineHeight: 1.5, color: '#333' }}>
                        {data.summary}
                    </div>
                </>
            )}

            {/* If there's an objective but no summary, show it here as About Me */}
            {isVisible(data, 'objective') && data.objective && (!isVisible(data, 'summary') || !data.summary) && (
                <>
                    <ProfSectionTitle>About Me</ProfSectionTitle>
                    <div style={{ textAlign: 'justify', marginBottom: '1rem', fontSize: '10pt', lineHeight: 1.5, color: '#333' }}>
                        {data.objective}
                    </div>
                </>
            )}

            {isVisible(data, 'education') && data.education && data.education.length > 0 && (
                <>
                    <ProfSectionTitle>Education</ProfSectionTitle>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', color: '#555', marginBottom: '0.15rem', fontSize: '10pt' }}>
                                <span style={{ marginRight: '0.25rem' }}>{edu.school}</span>
                                {edu.dates && <span> | {edu.dates}</span>}
                            </div>
                            <div style={{ fontWeight: '800', fontSize: '10.5pt', color: '#111', marginBottom: '0.25rem' }}>{edu.degree}</div>
                            {edu.details && <div style={{ textAlign: 'justify', lineHeight: 1.5, fontSize: '10pt', color: '#333' }}>{edu.details}</div>}
                        </div>
                    ))}
                </>
            )}

            {isVisible(data, 'experience') && data.experience && data.experience.length > 0 && (
                <>
                    <ProfSectionTitle>Work Experience</ProfSectionTitle>
                    {data.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', color: '#555', marginBottom: '0.15rem', fontSize: '10pt' }}>
                                <span style={{ marginRight: '0.25rem' }}>{exp.company}</span>
                                {exp.dates && <span> | {exp.dates}</span>}
                            </div>
                            <div style={{ fontWeight: '800', fontSize: '10.5pt', color: '#111', marginBottom: '0.25rem' }}>{exp.title}</div>
                            <div style={{ textAlign: 'justify', lineHeight: 1.5, fontSize: '10pt', color: '#333', whiteSpace: 'pre-line' }}>{exp.description}</div>
                        </div>
                    ))}
                </>
            )}

            {isVisible(data, 'skills') && data.skills && data.skills.length > 0 && (
                <>
                    <ProfSectionTitle>Skills</ProfSectionTitle>
                    <SkillsGrid>
                        {data.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </SkillsGrid>
                </>
            )}

            {isVisible(data, 'projects') && data.projects && data.projects.length > 0 && (
                <>
                    <ProfSectionTitle>Projects</ProfSectionTitle>
                    {data.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontWeight: '800', fontSize: '10.5pt', color: '#111', marginBottom: '0.25rem' }}>{proj.name}</div>
                            <div style={{ textAlign: 'justify', lineHeight: 1.5, fontSize: '10pt', color: '#333', whiteSpace: 'pre-line' }}>{proj.description}</div>
                        </div>
                    ))}
                </>
            )}

            {isVisible(data, 'references') && data.references && data.references.length > 0 && (
                <>
                    <ProfSectionTitle>References</ProfSectionTitle>
                    <div style={{ fontSize: '10pt', lineHeight: 1.5, whiteSpace: 'pre-line', color: '#333' }}>
                        {data.references.join('\n')}
                    </div>
                </>
            )}

            {isVisible(data, 'cover_letter') && data.cover_letter && (
                <div style={{ pageBreakBefore: 'always' }}>
                    <ProfSectionTitle>Cover Letter</ProfSectionTitle>
                    <div style={{ fontSize: '10pt', lineHeight: 1.5, whiteSpace: 'pre-line', color: '#333' }}>
                        {data.cover_letter}
                    </div>
                </div>
            )}
        </ProfWrapper>
    );
}
