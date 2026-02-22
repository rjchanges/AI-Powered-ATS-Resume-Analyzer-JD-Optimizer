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
  
  @media (max-width: 768px) {
    min-height: auto;
  }
`;

// Helper to check visibility
const isVisible = (data, section) => data?.visibility ? data.visibility[section] !== false : true;


/* =========================================
   Professional Template
   ========================================= */
const ProfWrapper = styled(PreviewContainer)`
  padding: ${({ spacing }) => (spacing === 'compact' ? '2rem' : spacing === 'spacious' ? '4rem' : '3rem')};
  font-family: ${({ fontFamily }) => fontFamily || "'Helvetica Neue', Helvetica, Arial, sans-serif"};
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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
    const styles = data.styles || {
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: 1.5,
        alignment: 'left',
        layoutSpacing: 'normal'
    };

    const sectionMb = styles.layoutSpacing === 'compact' ? '0.85rem' : styles.layoutSpacing === 'spacious' ? '1.75rem' : '1.25rem';
    const innerMb = styles.layoutSpacing === 'compact' ? '0.5rem' : styles.layoutSpacing === 'spacious' ? '1.2rem' : '1rem';

    return (
        <ProfWrapper fontFamily={styles.fontFamily} spacing={styles.layoutSpacing}>
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
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>About Me</ProfSectionTitle>
                    <div style={{ textAlign: styles.alignment, marginBottom: innerMb, fontSize: styles.fontSize, lineHeight: styles.lineHeight, color: '#333' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {isVisible(data, 'education') && data.education && data.education.length > 0 && (
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>Education</ProfSectionTitle>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: innerMb }}>
                            <div style={{ display: 'flex', color: '#555', marginBottom: '0.15rem', fontSize: styles.fontSize }}>
                                <span style={{ marginRight: '0.25rem' }}>{edu.school}</span>
                                {edu.dates && <span> | {edu.dates}</span>}
                            </div>
                            <div style={{ fontWeight: '800', fontSize: `calc(${styles.fontSize} + 0.5pt)`, color: '#111', marginBottom: '0.25rem' }}>{edu.degree}</div>
                            {edu.details && <div style={{ textAlign: styles.alignment, lineHeight: styles.lineHeight, fontSize: styles.fontSize, color: '#333' }}>{edu.details}</div>}
                        </div>
                    ))}
                </div>
            )}

            {isVisible(data, 'experience') && data.experience && data.experience.length > 0 && (
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>Work Experience</ProfSectionTitle>
                    {data.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: innerMb }}>
                            <div style={{ display: 'flex', color: '#555', marginBottom: '0.15rem', fontSize: styles.fontSize }}>
                                <span style={{ marginRight: '0.25rem' }}>{exp.company}</span>
                                {exp.dates && <span> | {exp.dates}</span>}
                            </div>
                            <div style={{ fontWeight: '800', fontSize: `calc(${styles.fontSize} + 0.5pt)`, color: '#111', marginBottom: '0.25rem' }}>{exp.title}</div>
                            <div style={{ textAlign: styles.alignment, lineHeight: styles.lineHeight, fontSize: styles.fontSize, color: '#333', whiteSpace: 'pre-line' }}>{exp.description}</div>
                        </div>
                    ))}
                </div>
            )}

            {isVisible(data, 'skills') && data.skills && data.skills.length > 0 && (
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>Skills</ProfSectionTitle>
                    <SkillsGrid style={{ fontSize: styles.fontSize }}>
                        {data.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </SkillsGrid>
                </div>
            )}

            {isVisible(data, 'projects') && data.projects && data.projects.length > 0 && (
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>Projects</ProfSectionTitle>
                    {data.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: innerMb }}>
                            <div style={{ fontWeight: '800', fontSize: `calc(${styles.fontSize} + 0.5pt)`, color: '#111', marginBottom: '0.25rem' }}>{proj.name}</div>
                            <div style={{ textAlign: styles.alignment, lineHeight: styles.lineHeight, fontSize: styles.fontSize, color: '#333', whiteSpace: 'pre-line' }}>{proj.description}</div>
                        </div>
                    ))}
                </div>
            )}

            {isVisible(data, 'references') && data.references && data.references.length > 0 && (
                <div style={{ marginBottom: sectionMb }}>
                    <ProfSectionTitle>References</ProfSectionTitle>
                    <div style={{ fontSize: styles.fontSize, textAlign: styles.alignment, lineHeight: styles.lineHeight, whiteSpace: 'pre-line', color: '#333' }}>
                        {data.references.join('\n')}
                    </div>
                </div>
            )}

            {isVisible(data, 'cover_letter') && data.cover_letter && (
                <div style={{ pageBreakBefore: 'always' }}>
                    <ProfSectionTitle>Cover Letter</ProfSectionTitle>
                    <div style={{ fontSize: styles.fontSize, textAlign: styles.alignment, lineHeight: styles.lineHeight, whiteSpace: 'pre-line', color: '#333' }}>
                        {data.cover_letter}
                    </div>
                </div>
            )}
        </ProfWrapper>
    );
}

