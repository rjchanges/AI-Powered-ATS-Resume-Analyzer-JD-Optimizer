import React from 'react';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ScoreSection = styled.div`
  width: 150px;
  flex-shrink: 0;
`;

const InfoSection = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const TagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background: rgba(255, 107, 107, 0.15);
  color: ${({ theme }) => theme.colors.error};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SuggestionList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  
  li {
    margin-bottom: 0.5rem;
  }
`;

export default function ResultCard({ result }) {
    if (!result) return null;

    const { match_score, missing_skills, suggestions } = result;

    // Determine color based on score
    let scoreColor = '#ff6b6b'; // red
    if (match_score >= 80) scoreColor = '#4caf50'; // green
    else if (match_score >= 60) scoreColor = '#ff9800'; // orange

    return (
        <Card>
            <Title>Analysis Results</Title>

            <FlexRow>
                <ScoreSection>
                    <CircularProgressbar
                        value={match_score}
                        text={`${match_score}%`}
                        styles={buildStyles({
                            textColor: '#fff',
                            pathColor: scoreColor,
                            trailColor: 'rgba(255,255,255,0.1)',
                            textSize: '24px'
                        })}
                    />
                </ScoreSection>

                <InfoSection>
                    {missing_skills && missing_skills.length > 0 && (
                        <>
                            <h4>Missing High-Priority Keywords</h4>
                            <TagGrid>
                                {missing_skills.map((skill, index) => (
                                    <Tag key={index}>{skill}</Tag>
                                ))}
                            </TagGrid>
                        </>
                    )}

                    {suggestions && suggestions.length > 0 && (
                        <>
                            <h4>Improvement Suggestions</h4>
                            <SuggestionList>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </SuggestionList>
                        </>
                    )}
                </InfoSection>
            </FlexRow>
        </Card>
    );
}
