import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{
      textAlign: 'center', padding: '80px 20px',
      fontFamily: "'Segoe UI', sans-serif",
      minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff 0%,#fafafa 100%)'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎙</div>
      <h1 style={{ fontSize: '3rem', color: '#6366f1', margin: '0 0 12px' }}>VoiceCV</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', margin: '0 0 8px' }}>Not a prompt. An interview.</p>
      <p style={{ color: '#888', maxWidth: '420px', margin: '0 auto 48px', lineHeight: 1.7 }}>
        Just talk. We'll build your professional resume, analyze your skill gaps,
        and find matching internships — all in minutes.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', marginBottom: '48px' }}>
        <button onClick={() => nav('/interview')} style={{
          background: '#6366f1', color: 'white', border: 'none',
          padding: '18px 48px', borderRadius: '50px', fontSize: '1.1rem',
          cursor: 'pointer', fontWeight: '600', width: '280px'
        }}>
          🎙 Start My Interview
        </button>
      </div>

      {/* Feature cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', maxWidth: '700px', margin: '0 auto'
      }}>
        {[
          { icon: '📝', title: 'Voice Interview', desc: 'Answer 13 questions by speaking naturally' },
          { icon: '📄', title: 'Resume Builder', desc: 'AI generates a professional resume instantly' },
          { icon: '📊', title: 'Skill Gap Analysis', desc: 'See what skills you need for your target role' },
          { icon: '💼', title: 'Job Matching', desc: 'Find real internships matching your profile' },
        ].map((f, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            border: '1px solid #e5e7eb', textAlign: 'left'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{f.icon}</div>
            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{f.title}</div>
            <div style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}