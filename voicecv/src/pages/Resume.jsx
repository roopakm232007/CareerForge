import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GROQ_API_KEY = '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';

const SYSTEM_PROMPT = `You are a professional resume writer. Given a student's interview answers, extract and structure the information into a complete, professional resume JSON.

Return ONLY valid JSON with this exact structure (no markdown, no backticks, no explanation):
{
  "name": "Full Name",
  "location": "City, State, Country",
  "phone": "+91 XXXXX XXXXX",
  "email": "email@example.com",
  "linkedin": "linkedin.com/in/profile or empty string",
  "github": "github.com/profile or empty string",
  "objective": "2-3 sentence professional career objective paragraph",
  "education": [
    {
      "degree": "Bachelor of Engineering (B.E.) – Computer Science and Engineering",
      "institution": "College Name",
      "location": "City",
      "year": "Expected 2027",
      "grade": "CGPA: 8.5/10"
    },
    {
      "degree": "Higher Secondary Education (HSC / PUC)",
      "institution": "College Name",
      "location": "City",
      "year": "2023",
      "grade": "Percentage: 85%"
    },
    {
      "degree": "Secondary Education (SSLC / 10th)",
      "institution": "School Name",
      "location": "City",
      "year": "2021",
      "grade": "Percentage: 90%"
    }
  ],
  "technicalSkills": {
    "programmingLanguages": ["C", "Python"],
    "webTechnologies": ["HTML", "CSS"],
    "databases": ["MySQL"],
    "toolsAndPlatforms": ["Git", "GitHub", "VS Code"],
    "coreSubjects": ["Data Structures", "Problem Solving"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "2-3 sentence professional description of the project, what it does, technologies used, and impact."
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "achievements": ["Achievement 1", "Achievement 2"],
  "extracurriculars": ["Activity 1", "Activity 2"],
  "softSkills": ["Communication Skills", "Team Collaboration", "Problem Solving"],
  "languages": ["English", "Tamil", "Hindi"]
}

Rules:
- If information is missing or unclear, make reasonable professional assumptions for a CS student
- Write the objective as a strong, professional paragraph tailored to their goals
- Expand thin answers into professional-sounding bullet points
- For projects, write 2-3 professional sentences even if the student gave brief info
- Always include at least 3 education entries (degree, PUC/12th, 10th) — use placeholders if needed
- Return ONLY the JSON object, nothing else`;

export default function Resume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    generateResume();
  }, []);

  const generateResume = async () => {
    setLoading(true);
    setError(null);

    const raw = localStorage.getItem('voicecv_answers');
    if (!raw) {
      setError('No answers found. Please complete the interview first.');
      setLoading(false);
      return;
    }

    let answers;
    try {
      answers = JSON.parse(raw);
    } catch {
      setError('Saved answers are corrupted. Please redo the interview.');
      setLoading(false);
      return;
    }

    const userContent = answers
      .map((a, i) => `Q${i + 1} [${a.key || 'info'}]: ${a.question}\nAnswer: ${a.answer}`)
      .join('\n\n');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 2000,
          temperature: 0.3,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userContent },
          ],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error('Groq API error:', response.status, errBody);
        setError(`API error ${response.status}. Please try again.`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResumeData(parsed);
    } catch (err) {
      console.error('Resume generation error:', err);
      setError('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        width: '48px', height: '48px', border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1', borderRadius: '50%',
        animation: 'spin 1s linear infinite', marginBottom: '20px',
      }} />
      <p style={{ color: '#6b7280', fontSize: '1rem' }}>Crafting your professional resume...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      maxWidth: '500px', margin: '80px auto', textAlign: 'center',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
      <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={generateResume} style={{
          background: '#6366f1', color: 'white', border: 'none',
          padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem',
        }}>
          🔁 Retry
        </button>
        <button onClick={() => nav('/')} style={{
          background: '#f3f4f6', color: '#374151', border: '1.5px solid #d1d5db',
          padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem',
        }}>
          ← Start Over
        </button>
      </div>
    </div>
  );

  const d = resumeData;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f1f5f9; }

        .resume-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 24px 20px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-primary { background: #6366f1; color: white; }
        .btn-primary:hover { background: #4f46e5; }
        .btn-secondary { background: #f1f5f9; color: #374151; border: 1.5px solid #d1d5db; }
        .btn-secondary:hover { background: #e2e8f0; }

        .resume-wrapper {
          max-width: 860px;
          margin: 32px auto;
          padding: 0 20px 60px;
        }

        .resume-paper {
          background: white;
          padding: 52px 56px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          border-radius: 4px;
          font-family: 'EB Garamond', Georgia, serif;
          color: #1a1a2e;
          font-size: 11.5pt;
          line-height: 1.55;
        }

        .resume-header {
          text-align: center;
          border-bottom: 2.5px solid #1a1a2e;
          padding-bottom: 14px;
          margin-bottom: 14px;
        }

        .resume-name {
          font-size: 26pt;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #1a1a2e;
          margin-bottom: 8px;
        }

        .resume-contact {
          font-family: 'Inter', sans-serif;
          font-size: 9.5pt;
          color: #374151;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 18px;
          margin-top: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .resume-section { margin-bottom: 18px; }

        .section-title {
          font-family: 'Inter', sans-serif;
          font-size: 10pt;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3730a3;
          border-bottom: 1.5px solid #3730a3;
          padding-bottom: 3px;
          margin-bottom: 10px;
        }

        .section-body { padding-left: 2px; }

        .objective-text {
          color: #1f2937;
          text-align: justify;
          line-height: 1.7;
        }

        .edu-entry {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .edu-left { flex: 1; }
        .edu-degree { font-weight: 600; color: #1a1a2e; }

        .edu-institution {
          font-style: italic;
          color: #4b5563;
          font-size: 10.5pt;
        }

        .edu-right {
          font-family: 'Inter', sans-serif;
          font-size: 9.5pt;
          color: #4b5563;
          text-align: right;
          min-width: 130px;
          padding-left: 12px;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 5px 12px;
          font-size: 10.5pt;
        }

        .skill-label { font-weight: 600; color: #374151; }
        .skill-value { color: #1f2937; }

        .project-entry { margin-bottom: 12px; }

        .project-name {
          font-weight: 700;
          color: #1a1a2e;
          font-size: 11pt;
        }

        .project-desc {
          color: #374151;
          margin-top: 3px;
          text-align: justify;
          line-height: 1.6;
        }

        .resume-list { list-style: none; padding: 0; }

        .resume-list li {
          padding-left: 14px;
          position: relative;
          margin-bottom: 4px;
          color: #374151;
        }

        .resume-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #3730a3;
          font-size: 12pt;
          line-height: 1.4;
        }

        .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }

        .tag {
          background: #eef2ff;
          color: #3730a3;
          padding: 2px 10px;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 9pt;
          font-weight: 600;
        }

        .declaration {
          margin-top: 20px;
          font-size: 10pt;
          color: #4b5563;
          border-top: 1px solid #e5e7eb;
          padding-top: 14px;
        }

        .declaration-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 28px;
          font-family: 'Inter', sans-serif;
          font-size: 9.5pt;
          color: #6b7280;
        }

        @media print {
          .resume-actions { display: none !important; }
          body { background: white; }
          .resume-wrapper { margin: 0; padding: 0; max-width: 100%; }
          .resume-paper {
            box-shadow: none;
            border-radius: 0;
            padding: 30px 40px;
          }
          .tag { background: #f0f0f0 !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Action bar */}
  <div className="resume-actions">
  <button className="btn btn-secondary" onClick={() => nav('/interview')}>
    ← Edit Answers
  </button>
  <button className="btn btn-primary" onClick={handlePrint}>
    🖨️ Print / Save PDF
  </button>
  <button className="btn btn-secondary" onClick={() => nav('/skill-gap')}
    style={{ background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #86efac' }}>
    📊 Skill Gap Analysis →
  </button>
  <button className="btn btn-secondary" onClick={() => nav('/')}>
    🔄 Start Over
  </button>
</div>

      <div className="resume-wrapper">
        <div className="resume-paper">

          {/* HEADER */}
          <div className="resume-header">
            <div className="resume-name">{d.name || 'Your Name'}</div>
            <div className="resume-contact">
              {d.location && <span className="contact-item">📍 {d.location}</span>}
              {d.phone && <span className="contact-item">📞 {d.phone}</span>}
              {d.email && <span className="contact-item">✉️ {d.email}</span>}
              {d.linkedin && <span className="contact-item">🔗 {d.linkedin}</span>}
              {d.github && <span className="contact-item">💻 {d.github}</span>}
            </div>
          </div>

          {/* CAREER OBJECTIVE */}
          {d.objective && (
            <div className="resume-section">
              <div className="section-title">Career Objective</div>
              <div className="section-body">
                <p className="objective-text">{d.objective}</p>
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {d.education?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Education</div>
              <div className="section-body">
                {d.education.map((edu, i) => (
                  <div className="edu-entry" key={i}>
                    <div className="edu-left">
                      <div className="edu-degree">{edu.degree}</div>
                      <div className="edu-institution">
                        {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                      </div>
                    </div>
                    <div className="edu-right">
                      <div>{edu.year}</div>
                      <div>{edu.grade}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TECHNICAL SKILLS */}
          {d.technicalSkills && (
            <div className="resume-section">
              <div className="section-title">Technical Skills</div>
              <div className="section-body">
                <div className="skills-grid">
                  {d.technicalSkills.programmingLanguages?.length > 0 && (<>
                    <span className="skill-label">Programming Languages:</span>
                    <span className="skill-value">{d.technicalSkills.programmingLanguages.join(', ')}</span>
                  </>)}
                  {d.technicalSkills.webTechnologies?.length > 0 && (<>
                    <span className="skill-label">Web Technologies:</span>
                    <span className="skill-value">{d.technicalSkills.webTechnologies.join(', ')}</span>
                  </>)}
                  {d.technicalSkills.databases?.length > 0 && (<>
                    <span className="skill-label">Database:</span>
                    <span className="skill-value">{d.technicalSkills.databases.join(', ')}</span>
                  </>)}
                  {d.technicalSkills.toolsAndPlatforms?.length > 0 && (<>
                    <span className="skill-label">Tools & Platforms:</span>
                    <span className="skill-value">{d.technicalSkills.toolsAndPlatforms.join(', ')}</span>
                  </>)}
                  {d.technicalSkills.coreSubjects?.length > 0 && (<>
                    <span className="skill-label">Core Subjects:</span>
                    <span className="skill-value">{d.technicalSkills.coreSubjects.join(', ')}</span>
                  </>)}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {d.projects?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Projects</div>
              <div className="section-body">
                {d.projects.map((proj, i) => (
                  <div className="project-entry" key={i}>
                    <div className="project-name">{proj.name}</div>
                    <div className="project-desc">{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {d.certifications?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Certifications</div>
              <div className="section-body">
                <ul className="resume-list">
                  {d.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {d.achievements?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Achievements</div>
              <div className="section-body">
                <ul className="resume-list">
                  {d.achievements.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* EXTRACURRICULARS */}
          {d.extracurriculars?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Extracurricular Activities</div>
              <div className="section-body">
                <ul className="resume-list">
                  {d.extracurriculars.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* SOFT SKILLS */}
          {d.softSkills?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Soft Skills</div>
              <div className="section-body">
                <div className="tag-list">
                  {d.softSkills.map((s, i) => <span className="tag" key={i}>{s}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {d.languages?.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Languages Known</div>
              <div className="section-body">
                <div className="tag-list">
                  {d.languages.map((l, i) => <span className="tag" key={i}>{l}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* DECLARATION */}
          <div className="declaration">
            <p>
              I hereby declare that the above information is true and correct to the best of my knowledge and belief.
            </p>
            <div className="declaration-footer">
              <span>Date: ____________________ &nbsp;&nbsp; Place: {d.location?.split(',')[0] || '___________'}</span>
              <span style={{ fontStyle: 'italic' }}>Signature: {d.name}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}