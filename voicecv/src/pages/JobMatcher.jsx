import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GROQ_API_KEY = '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';

export default function JobMatcher() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => { matchJobs(); }, []);

  const matchJobs = async () => {
    setLoading(true);
    setError('');

    const answers = localStorage.getItem('voicecv_answers') || '[]';

    const prompt = `Based on this student's profile from their interview answers:
${answers}

Generate 6 realistic internship matches from Indian companies suited to their skills and background.

Return ONLY a raw JSON array, no markdown, no backticks, no explanation:
[
  {
    "company": "Zoho",
    "role": "Frontend Intern",
    "location": "Chennai, Tamil Nadu",
    "stipend": "12,000",
    "duration": "3 months",
    "match": 82,
    "skills": ["HTML", "CSS", "JavaScript"],
    "apply": "https://careers.zohocorp.com",
    "badge": "Top Pick"
  }
]

Rules:
- Include a mix of companies: Zoho, Freshworks, Infosys, TCS, Wipro, BYJU's, Swiggy, Razorpay, Internshala startups
- match is a realistic integer from 50-95 based on the student's actual skills
- stipend is monthly in INR (numbers only, no ₹ symbol)
- skills lists the key skills this job needs
- badge can be "Top Pick", "Best Match", "Great Fit", or "" (empty string)
- Sort by match score descending
- Return ONLY the JSON array`;

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
          temperature: 0.5,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (data.error) { setError('Error: ' + data.error.message); setLoading(false); return; }

      const raw = data.choices[0].message.content;
      const clean = raw.replace(/```json|```/g, '').trim();
      setJobs(JSON.parse(clean));
    } catch (e) {
      setError('Failed to load matches. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        width: '48px', height: '48px', border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1', borderRadius: '50%',
        animation: 'spin 1s linear infinite', marginBottom: '20px',
      }} />
      <p style={{ color: '#6b7280' }}>🔍 Finding your best internship matches...</p>
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
        <button onClick={matchJobs} style={{
          background: '#6366f1', color: 'white', border: 'none',
          padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem',
        }}>🔁 Retry</button>
        <button onClick={() => nav('/skill-gap')} style={{
          background: '#f3f4f6', color: '#374151', border: '1.5px solid #d1d5db',
          padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem',
        }}>← Back</button>
      </div>
    </div>
  );

  return (
    <div style={{
      maxWidth: '680px', margin: '40px auto', padding: '0 20px 60px',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <button onClick={() => nav('/skill-gap')} style={{
        background: 'none', border: 'none', color: '#6366f1',
        cursor: 'pointer', fontSize: '0.9rem', padding: '0', marginBottom: '20px',
      }}>← Back to Skill Gap</button>

      <h2 style={{ color: '#1f2937', margin: '0 0 6px' }}>💼 Your Internship Matches</h2>
      <p style={{ color: '#6b7280', marginBottom: '28px' }}>
        {jobs?.length} opportunities matched to your skills and profile.
      </p>

      {/* Job cards */}
      {jobs?.map((job, i) => (
        <div key={i} style={{
          background: 'white',
          border: i === 0 ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
          borderRadius: '14px', padding: '20px 22px', marginBottom: '16px',
          position: 'relative',
        }}>
          {/* Badge */}
          {job.badge && (
            <span style={{
              position: 'absolute', top: '16px', right: '16px',
              background: i === 0 ? '#6366f1' : '#eef2ff',
              color: i === 0 ? 'white' : '#6366f1',
              fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', fontWeight: '700',
            }}>
              {job.badge}
            </span>
          )}

          {/* Company + Role */}
          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 3px', color: '#1f2937', fontSize: '1.1rem' }}>{job.company}</h3>
            <p style={{ margin: 0, color: '#6366f1', fontWeight: '600', fontSize: '0.95rem' }}>{job.role}</p>
          </div>

          {/* Meta info */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px',
          }}>
            <span>📍 {job.location}</span>
            <span>💰 ₹{job.stipend}/mo</span>
            <span>📅 {job.duration}</span>
          </div>

          {/* Skills needed */}
          {job.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {job.skills.map((s, j) => (
                <span key={j} style={{
                  background: '#f3f4f6', color: '#374151',
                  padding: '2px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '500',
                }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Match bar + Apply */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Match</span>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#6366f1' }}>{job.match}%</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '6px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                  width: `${job.match}%`, height: '6px', borderRadius: '999px',
                }} />
              </div>
            </div>
            <a href={job.apply} target="_blank" rel="noreferrer" style={{
              background: '#6366f1', color: 'white', padding: '9px 20px',
              borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem',
              fontWeight: '600', whiteSpace: 'nowrap',
            }}>
              Apply Now →
            </a>
          </div>
        </div>
      ))}

      {/* Bottom actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button onClick={matchJobs} style={{
          flex: 1, background: '#f3f4f6', color: '#374151',
          border: '1.5px solid #d1d5db', padding: '13px', borderRadius: '10px',
          cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600',
        }}>
          🔄 Refresh Matches
        </button>
        <button onClick={() => nav('/')} style={{
          flex: 1, background: '#6366f1', color: 'white', border: 'none',
          padding: '13px', borderRadius: '10px', cursor: 'pointer',
          fontSize: '0.95rem', fontWeight: '600',
        }}>
          🏠 Start Over
        </button>
      </div>
    </div>
  );
}