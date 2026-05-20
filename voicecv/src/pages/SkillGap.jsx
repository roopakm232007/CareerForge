import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GROQ_API_KEY = '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';

const ROLES = [
  'Frontend Intern',
  'Backend Intern',
  'Full Stack Intern',
  'Data Analyst',
  'ML Engineer',
  'Android Developer Intern',
  'DevOps Intern',
  'UI/UX Designer Intern',
];

export default function SkillGap() {
  const [role, setRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const analyze = async () => {
    if (!role) { alert('Please select a target role first!'); return; }
    setLoading(true);
    setError('');
    setResult(null);

    const answers = localStorage.getItem('voicecv_answers') || '[]';

    const prompt = `A student wants to become a "${role}". Here is their background from an interview:
${answers}

Analyze their skills versus what is required for a "${role}" internship in India.

Return ONLY a raw JSON object, no markdown, no backticks, no explanation:
{
  "match": 65,
  "summary": "One sentence summary of the student's readiness for this role.",
  "have": ["skill1", "skill2", "skill3"],
  "missing": ["skill3", "skill4", "skill5"],
  "resources": [
    {
      "skill": "skill3",
      "description": "Why this skill matters for the role.",
      "link": "https://freecodecamp.org",
      "platform": "freeCodeCamp",
      "time": "2 weeks"
    }
  ]
}

Rules:
- match should be a realistic integer 0-100
- have should list skills the student ALREADY has relevant to this role
- missing should list the top 4-5 skills they need to learn
- resources must have one entry per missing skill with a real, working free learning link
- Return ONLY the JSON, nothing else`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1500,
          temperature: 0.4,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (data.error) { setError('Error: ' + data.error.message); setLoading(false); return; }

      const raw = data.choices[0].message.content;
      const clean = raw.replace(/```json|```/g, '').trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setError('Failed to analyze. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (pct) => {
    if (pct >= 70) return '#16a34a';
    if (pct >= 40) return '#d97706';
    return '#dc2626';
  };

  const matchBg = (pct) => {
    if (pct >= 70) return '#f0fdf4';
    if (pct >= 40) return '#fffbeb';
    return '#fef2f2';
  };

  return (
    <div style={{
      maxWidth: '640px', margin: '40px auto', padding: '0 20px',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <button onClick={() => nav('/resume')} style={{
        background: 'none', border: 'none', color: '#6366f1',
        cursor: 'pointer', fontSize: '0.9rem', padding: '0', marginBottom: '20px'
      }}>← Back to Resume</button>

      <h2 style={{ color: '#1f2937', margin: '0 0 6px' }}>📊 Skill Gap Analysis</h2>
      <p style={{ color: '#6b7280', marginBottom: '28px' }}>
        Pick your target role and see exactly what you need to learn.
      </p>

      {/* Role selector */}
      <select value={role} onChange={e => setRole(e.target.value)} style={{
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1.5px solid #d1d5db', fontSize: '1rem', marginBottom: '14px',
        background: 'white', color: '#1f2937', outline: 'none',
      }}>
        <option value="">-- Select your target role --</option>
        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <button onClick={analyze} disabled={loading} style={{
        background: loading ? '#a5b4fc' : '#6366f1', color: 'white', border: 'none',
        padding: '13px 32px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '1rem', width: '100%', fontWeight: '600', marginBottom: '8px',
      }}>
        {loading ? '⏳ Analyzing your profile...' : '🔍 Analyze My Skills'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px',
          padding: '12px', color: '#b91c1c', marginTop: '12px', fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: '32px' }}>

          {/* Match score */}
          <div style={{
            background: matchBg(result.match), padding: '24px 20px', borderRadius: '14px',
            textAlign: 'center', marginBottom: '20px',
            border: `1.5px solid ${matchColor(result.match)}30`,
          }}>
            <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '0.9rem' }}>
              Match Score for <strong>{role}</strong>
            </p>
            <div style={{
              fontSize: '3.5rem', fontWeight: '800', color: matchColor(result.match), lineHeight: 1,
            }}>
              {result.match}%
            </div>
            {result.summary && (
              <p style={{ margin: '12px 0 0', color: '#374151', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {result.summary}
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div style={{
            background: '#e5e7eb', borderRadius: '999px', height: '10px', marginBottom: '24px',
          }}>
            <div style={{
              background: matchColor(result.match),
              width: `${result.match}%`, height: '10px', borderRadius: '999px',
              transition: 'width 0.6s ease',
            }} />
          </div>

          {/* Have vs Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 10px', fontWeight: '700', color: '#16a34a', fontSize: '0.95rem' }}>
                ✅ You already have
              </p>
              {result.have?.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  margin: '5px 0', color: '#374151', fontSize: '0.88rem',
                }}>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>•</span> {s}
                </div>
              ))}
            </div>
            <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <p style={{ margin: '0 0 10px', fontWeight: '700', color: '#dc2626', fontSize: '0.95rem' }}>
                ❌ You need to learn
              </p>
              {result.missing?.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  margin: '5px 0', color: '#374151', fontSize: '0.88rem',
                }}>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>•</span> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Learning roadmap */}
          <h3 style={{ color: '#1f2937', marginBottom: '14px' }}>🗺 Your Learning Roadmap</h3>
          {result.resources?.map((r, i) => (
            <div key={i} style={{
              background: 'white', border: '1.5px solid #e5e7eb',
              borderRadius: '12px', padding: '16px 18px', marginBottom: '12px',
              borderLeft: '4px solid #6366f1',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <strong style={{ color: '#1f2937', fontSize: '1rem' }}>{r.skill}</strong>
                <span style={{
                  background: '#eef2ff', color: '#6366f1', padding: '2px 10px',
                  borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap',
                }}>⏱ {r.time}</span>
              </div>
              {r.description && (
                <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {r.description}
                </p>
              )}
              <a href={r.link} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                color: '#6366f1', fontSize: '0.88rem', fontWeight: '600', textDecoration: 'none',
              }}>
                Learn on {r.platform || 'Free Resource'} →
              </a>
            </div>
          ))}

          {/* CTA to jobs */}
          <button onClick={() => nav('/jobs')} style={{
            background: '#6366f1', color: 'white', border: 'none',
            padding: '14px 32px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '1rem', width: '100%', marginTop: '12px', fontWeight: '600',
          }}>
            💼 Find Matching Internships →
          </button>
        </div>
      )}
    </div>
  );
}