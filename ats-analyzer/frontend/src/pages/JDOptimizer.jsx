import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import UploadArea from '../components/UploadArea';
import JobDescription from '../components/JobDescription';
import AnalyzeButton from '../components/AnalyzeButton';
import ResumeEditor from '../components/ResumeEditor';
import { ProfessionalTemplate } from '../components/ResumeTemplates';
import { analyzeTailored } from '../api';

const MainLayout = styled.div`
  max-width: 1400px; margin: 0 auto; padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;

const Header = styled.header`
  text-align: center; margin-bottom: 3rem;
  h1 { font-size: 3rem; color: ${({ theme }) => theme.colors.primary}; font-weight: 700; margin-bottom: 0.5rem; }
  p { color: ${({ theme }) => theme.colors.textDim}; font-size: 1.15rem; font-weight: 300;}
`;

const ContentGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.errorBg}; color: ${({ theme }) => theme.colors.error}; padding: 1rem; border-radius: ${({ theme }) => theme.borderRadius}; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 1.5rem;
`;

const ResultsSection = styled.div`
  margin-top: 4rem; padding-top: 3rem; border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DualPaneLayout = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const DownloadBtn = styled.button`
  display: flex; align-items: center; gap: 0.5rem; background: ${({ theme }) => theme.colors.success}; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: ${({ theme }) => theme.borderRadius}; font-weight: 600; cursor: pointer; box-shadow: ${({ theme }) => theme.shadows.md};
  &:hover { background: #059669; transform: translateY(-1px); box-shadow: ${({ theme }) => theme.shadows.lg}; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface}; border-radius: ${({ theme }) => theme.borderRadius}; padding: 2rem; border: 1px solid ${({ theme }) => theme.colors.border}; display: flex; flex-direction: column; gap: 2rem; box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TagGrid = styled.div` display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; `;
const MatchedTag = styled.span` background: ${({ theme }) => theme.colors.successBg}; color: ${({ theme }) => theme.colors.success}; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; border: 1px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; gap: 0.3rem; `;
const MissingTag = styled.span` background: ${({ theme }) => theme.colors.errorBg}; color: ${({ theme }) => theme.colors.error}; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; border: 1px solid rgba(239, 68, 68, 0.3); display: flex; align-items: center; gap: 0.3rem; `;

export default function JDOptimizer() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Manage Editable Data
    const [editableResumeData, setEditableResumeData] = useState(null);

    useEffect(() => {
        if (result && result.resume_data) {
            setEditableResumeData(result.resume_data);
        }
    }, [result]);

    const handleAnalyze = async () => {
        if (!file || !jobDescription) return;
        setIsLoading(true); setError(''); setResult(null); setEditableResumeData(null);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const data = await analyzeTailored(formData);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Something went wrong analyzing the resume.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        const element = document.getElementById('resume-preview-export');
        if (!element) return;

        // Options tuned for high-quality export
        const opt = {
            margin: 0,
            filename: `${editableResumeData?.name?.replace(/\s+/g, '_') || 'Resume'}_Optimized.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const isFormValid = !!file && !!jobDescription.trim();

    return (
        <MainLayout>
            <Header>
                <h1>JD ATS Optimizer</h1>
                <p>Tailor and edit your resume perfectly to the job description</p>
            </Header>

            <ContentGrid>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <UploadArea file={file} setFile={setFile} />
                </div>
                <div>
                    <JobDescription value={jobDescription} onChange={setJobDescription} />
                </div>
            </ContentGrid>

            <AnalyzeButton onClick={handleAnalyze} isLoading={isLoading} disabled={!isFormValid} />
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {result && editableResumeData && (
                <ResultsSection>
                    {/* Top Analysis Card */}
                    <Card style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ width: '150px', flexShrink: 0, textAlign: 'center' }}>
                                <CircularProgressbar
                                    value={result.match_score}
                                    text={`${result.match_score}%`}
                                    styles={buildStyles({
                                        textColor: '#fff',
                                        pathColor: result.match_score >= 80 ? '#10b981' : result.match_score >= 60 ? '#f59e0b' : '#ef4444',
                                        trailColor: 'rgba(255,255,255,0.05)',
                                    })}
                                />
                                <h3 style={{ marginTop: '1rem', color: '#fff', fontSize: '1.1rem' }}>Match Score</h3>
                            </div>

                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h4 style={{ color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Matched Keywords</h4>
                                <TagGrid>{result.matched_keywords?.map((k, i) => <MatchedTag key={i}><FaCheckCircle size={12} /> {k}</MatchedTag>)}</TagGrid>

                                <h4 style={{ color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '0.25rem', marginBottom: '0.75rem', marginTop: '1rem' }}>Missing Keywords</h4>
                                <TagGrid>{result.missing_keywords?.map((k, i) => <MissingTag key={i}><FaExclamationTriangle size={12} /> {k}</MissingTag>)}</TagGrid>

                                {result.priority_missing_skills?.length > 0 && (
                                    <>
                                        <h4 style={{ color: '#f59e0b', marginTop: '1.5rem' }}>Priority Skills to Consider Adding</h4>
                                        <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', margin: 0, lineHeight: 1.6 }}>
                                            {result.priority_missing_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Dual Pane: Editor and Live Preview */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '3rem' }}>
                        <h2 style={{ margin: 0 }}>Live Real-Time Editor</h2>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <DownloadBtn onClick={handleDownload}><FaDownload /> Download PDF Free</DownloadBtn>
                        </div>
                    </div>

                    <DualPaneLayout>
                        {/* Editor Pane (Left) */}
                        <div>
                            <ResumeEditor
                                data={editableResumeData}
                                onChange={setEditableResumeData}
                            />
                        </div>

                        {/* Preview Pane (Right) */}
                        <div style={{
                            position: 'relative',
                            background: '#e2e8f0', // Slight gray to contrast the white paper
                            padding: '2rem',
                            borderRadius: '12px',
                            overflowX: 'auto',
                            boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
                        }}>
                            <div id="resume-preview-export" style={{ background: 'white', minHeight: '1000px', width: '100%', maxWidth: '850px', margin: '0 auto', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}>
                                <ProfessionalTemplate data={editableResumeData} />
                            </div>
                        </div>
                    </DualPaneLayout>

                </ResultsSection>
            )}
        </MainLayout>
    );
}
