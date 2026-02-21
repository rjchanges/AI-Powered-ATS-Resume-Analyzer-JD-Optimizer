import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';

import UploadArea from '../components/UploadArea';
import AnalyzeButton from '../components/AnalyzeButton';
import { analyzeGeneral } from '../api';

const PageLayout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 { font-size: 2.5rem; color: ${({ theme }) => theme.colors.primary}; }
  p { color: ${({ theme }) => theme.colors.textDim}; font-size: 1.1rem; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 2rem;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  @media (max-width: 768px) { flex-direction: column; }
`;

const ScoreSection = styled.div`
  width: 150px; flex-shrink: 0; text-align: center;
`;

const TagGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
`;

const StrengthTag = styled.span`
  background: rgba(76, 175, 80, 0.15); color: #4caf50;
  padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; border: 1px solid rgba(76, 175, 80, 0.3);
`;

const WeaknessTag = styled.span`
  background: rgba(255, 107, 107, 0.15); color: #ff6b6b;
  padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SectionTitle = styled.h4`
  margin-top: 1.5rem; margin-bottom: 0.5rem; color: #fff; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; padding-bottom: 0.25rem;
`;

const BulletList = styled.ul`
  margin: 0; padding-left: 1.5rem; color: ${({ theme }) => theme.colors.text};
  li { margin-bottom: 0.25rem; }
`;

const RewriteContainer = styled.div`
  margin-top: 2rem;
  background: #000;
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  color: #ddd;
  border: 1px solid #333;
`;

const DownloadBtn = styled.button`
  display: flex; align-items: center; gap: 0.5rem; background: ${({ theme }) => theme.colors.success}; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: ${({ theme }) => theme.borderRadius}; font-weight: 600; cursor: pointer; margin-top: 1rem;
  &:hover { background: #43a047; }
`;

export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true); setError(''); setResult(null);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const data = await analyzeGeneral(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('ats-rewrite');
    if (!element) return;
    html2pdf().set({
      margin: 1, filename: 'ATS_Friendly_Resume.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save();
  };

  return (
    <PageLayout>
      <Header>
        <h1>General ATS Resume Checker</h1>
        <p>Upload your resume to evaluate its ATS compatibility and get an optimized rewrite.</p>
      </Header>

      <UploadArea file={file} setFile={setFile} />
      <AnalyzeButton onClick={handleAnalyze} isLoading={isLoading} disabled={!file} />

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {result && (
        <Card>
          <FlexRow>
            <ScoreSection>
              <CircularProgressbar
                value={result.ats_score}
                text={`${result.ats_score}%`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: result.ats_score >= 80 ? '#4caf50' : result.ats_score >= 60 ? '#ff9800' : '#ff6b6b',
                  trailColor: 'rgba(255,255,255,0.1)',
                })}
              />
              <h3 style={{ marginTop: '1rem', color: '#fff' }}>ATS Score</h3>
            </ScoreSection>

            <div style={{ flex: 1 }}>
              <SectionTitle>Strengths</SectionTitle>
              <TagGrid>{result.strengths?.map((s, i) => <StrengthTag key={i}>{s}</StrengthTag>)}</TagGrid>

              <SectionTitle>Weaknesses</SectionTitle>
              <TagGrid>{result.weaknesses?.map((w, i) => <WeaknessTag key={i}>{w}</WeaknessTag>)}</TagGrid>

              <SectionTitle>Missing Best Practices</SectionTitle>
              <BulletList>{result.missing_best_practices?.map((m, i) => <li key={i}>{m}</li>)}</BulletList>

              <SectionTitle>Improvement Guidance</SectionTitle>
              <BulletList>{result.improvement_guidance?.map((g, i) => <li key={i}>{g}</li>)}</BulletList>

              <SectionTitle>Quantified Achievements to Add</SectionTitle>
              <BulletList>{result.quantified_achievement_suggestions?.map((q, i) => <li key={i}>{q}</li>)}</BulletList>
            </div>
          </FlexRow>

          <SectionTitle>ATS-Friendly Rewrite</SectionTitle>
          <p style={{ color: '#aaa', fontSize: '0.85rem' }}>A clean, text-based version optimized for parsing.</p>
          <RewriteContainer id="ats-rewrite">
            {result.ats_friendly_rewrite}
          </RewriteContainer>
          <DownloadBtn onClick={handleDownload}><FaDownload /> Download Rewrite as PDF</DownloadBtn>
        </Card>
      )}
    </PageLayout>
  );
}
