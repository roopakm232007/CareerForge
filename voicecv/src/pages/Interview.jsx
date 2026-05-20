import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_KEY;

const LANGUAGES = [
  { label: 'English',            code: 'en-IN', whisper: 'en' },
  { label: 'हिंदी (Hindi)',       code: 'hi-IN', whisper: 'hi' },
  { label: 'தமிழ் (Tamil)',       code: 'ta-IN', whisper: 'ta' },
  { label: 'తెలుగు (Telugu)',     code: 'te-IN', whisper: 'te' },
  { label: 'ಕನ್ನಡ (Kannada)',     code: 'kn-IN', whisper: 'kn' },
  { label: 'മലയാളം (Malayalam)', code: 'ml-IN', whisper: 'ml' },
  { label: 'বাংলা (Bengali)',     code: 'bn-IN', whisper: 'bn' },
];

const QUESTIONS = {
  'en-IN': [
    "Tell me your full name and the city or place you are from.",
    "What course and college are you studying in? What year are you in and what is your current CGPA or percentage?",
    "Tell me about your school background — your 10th grade school name, year, and percentage, and your 12th grade or PUC college name, year, and percentage.",
    "What is your phone number and email address? Also, do you have a LinkedIn or GitHub profile? If yes, share those links.",
    "What technical skills do you have? For example, programming languages like C, Python, Java, web technologies like HTML or CSS, databases, or tools like Git.",
    "Tell me about a project you built — even a small one. What is the project name, what does it do, and what technologies did you use?",
    "Do you have any certifications? For example, online courses from Coursera, NPTEL, or any other platform.",
    "What are your career goals? What kind of job or field do you want to work in after graduation?",
    "Tell me about a challenge you faced — in college, a project, or personal life — and how you handled or solved it.",
    "What achievements do you have? This can be hackathons, competitions, scholarships, sports, or anything you are proud of.",
    "Tell me about your extracurricular activities or clubs you are part of — like coding clubs, NSS, NCC, cultural events, or volunteering.",
    "What are your soft skills? For example, communication, teamwork, leadership, time management, or problem solving.",
    "What languages do you speak? For example, English, Hindi, Tamil, Kannada, Telugu, Malayalam, or any others.",
  ],
  'hi-IN': [
    "अपना पूरा नाम और शहर बताइए जहाँ से आप हैं।",
    "आप कौन सा course और किस college में पढ़ रहे हैं? कौन से साल में हैं और आपका CGPA या percentage क्या है?",
    "अपनी school background बताइए — 10th का school, साल और percentage, और 12th का college, साल और percentage।",
    "आपका phone number और email क्या है? क्या आपका LinkedIn या GitHub है?",
    "आपको कौन सी technical skills आती हैं? जैसे programming languages, web technologies, databases, या tools।",
    "किसी project के बारे में बताइए — नाम, वो क्या करता है, और किन technologies से बना है।",
    "क्या आपने कोई certifications किए हैं? जैसे online courses।",
    "आपका career goal क्या है? graduation के बाद क्या करना चाहते हैं?",
    "किसी चुनौती के बारे में बताइए जिसे आपने solve किया।",
    "आपकी कोई achievement है? जैसे hackathon, competition, या scholarship।",
    "क्या आप किसी club या extracurricular activity में हैं?",
    "आपकी soft skills क्या हैं? जैसे communication, teamwork, leadership।",
    "आप कौन सी भाषाएँ बोलते हैं?",
  ],
  'ta-IN': [
    "உங்கள் முழு பெயர் மற்றும் நீங்கள் வாழும் இடம் சொல்லுங்கள்.",
    "நீங்கள் படிக்கும் course, college, year மற்றும் CGPA சொல்லுங்கள்.",
    "உங்கள் school background சொல்லுங்கள் — 10th school, year, percentage மற்றும் 12th college, year, percentage.",
    "உங்கள் phone number, email மற்றும் LinkedIn அல்லது GitHub link சொல்லுங்கள்.",
    "உங்களுக்கு தெரிந்த technical skills என்ன?",
    "நீங்கள் செய்த ஒரு project பெயர், அது என்ன செய்கிறது, எந்த technologies பயன்படுத்தினீர்கள்?",
    "ஏதாவது certifications இருக்கிறதா?",
    "உங்கள் career goal என்ன?",
    "நீங்கள் சந்தித்த சவாலை எப்படி தீர்த்தீர்கள்?",
    "ஏதாவது achievements இருக்கிறதா?",
    "நீங்கள் ஏதாவது club அல்லது extracurricular activities-ல் பங்கேற்கிறீர்களா?",
    "உங்கள் soft skills என்ன?",
    "நீங்கள் பேசும் மொழிகள் என்ன?",
  ],
  'te-IN': [
    "మీ పూర్తి పేరు మరియు మీరు ఉన్న నగరం చెప్పండి.",
    "మీరు చదువుతున్న course, college, year మరియు CGPA చెప్పండి.",
    "మీ school background చెప్పండి — 10th school, year, percentage మరియు 12th college, year, percentage.",
    "మీ phone number, email మరియు LinkedIn లేదా GitHub link చెప్పండి.",
    "మీకు తెలిసిన technical skills ఏమిటి?",
    "మీరు చేసిన ఒక project పేరు, అది ఏమి చేస్తుంది, ఏ technologies వాడారు?",
    "ఏమైనా certifications ఉన్నాయా?",
    "మీ career goal ఏమిటి?",
    "మీరు ఎదుర్కొన్న సవాలు మరియు దాన్ని ఎలా పరిష్కరించారు?",
    "ఏమైనా achievements ఉన్నాయా?",
    "మీరు ఏమైనా clubs లేదా extracurricular activities లో ఉన్నారా?",
    "మీ soft skills ఏమిటి?",
    "మీరు మాట్లాడే భాషలు ఏమిటి?",
  ],
  'kn-IN': [
    "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಮತ್ತು ನೀವಿರುವ ಊರು ಹೇಳಿ.",
    "ನೀವು ಓದುತ್ತಿರುವ course, college, year ಮತ್ತು CGPA ಹೇಳಿ.",
    "ನಿಮ್ಮ school background ಹೇಳಿ — 10th school, year, percentage ಮತ್ತು 12th college, year, percentage.",
    "ನಿಮ್ಮ phone number, email ಮತ್ತು LinkedIn ಅಥವಾ GitHub link ಹೇಳಿ.",
    "ನಿಮಗೆ ತಿಳಿದ technical skills ಏನು?",
    "ನೀವು ಮಾಡಿದ project ಹೆಸರು, ಅದೇನು ಮಾಡುತ್ತದೆ, ಯಾವ technologies ಬಳಸಿದ್ದೀರಿ?",
    "ಯಾವುದಾದರೂ certifications ಇವೆಯಾ?",
    "ನಿಮ್ಮ career goal ಏನು?",
    "ನೀವು ಎದುರಿಸಿದ ಸವಾಲು ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಪರಿಹರಿಸಿದ್ದೀರಿ?",
    "ಯಾವುದಾದರೂ achievements ಇವೆಯಾ?",
    "ನೀವು ಯಾವುದಾದರೂ clubs ಅಥವಾ extracurricular activities ನಲ್ಲಿದ್ದೀರಾ?",
    "ನಿಮ್ಮ soft skills ಏನು?",
    "ನೀವು ಮಾತನಾಡುವ ಭಾಷೆಗಳು ಯಾವುವು?",
  ],
  'ml-IN': [
    "നിങ്ങളുടെ പൂർണ്ണ പേരും നിങ്ങൾ താമസിക്കുന്ന സ്ഥലവും പറയൂ.",
    "നിങ്ങൾ പഠിക്കുന്ന course, college, year, CGPA പറയൂ.",
    "നിങ്ങളുടെ school background പറയൂ — 10th school, year, percentage, 12th college, year, percentage.",
    "നിങ്ങളുടെ phone number, email, LinkedIn അല്ലെങ്കിൽ GitHub link പറയൂ.",
    "നിങ്ങൾക്ക് അറിയാവുന്ന technical skills എന്തെല്ലാം?",
    "നിങ്ങൾ ചെയ്ത ഒരു project-ന്റെ പേര്, അതെന്ത് ചെയ്യുന്നു, ഏത് technologies ഉപയോഗിച്ചു?",
    "എന്തെങ്കിലും certifications ഉണ്ടോ?",
    "നിങ്ങളുടെ career goal എന്താണ്?",
    "നിങ്ങൾ നേരിട്ട ഒരു വെല്ലുവിളി എങ്ങനെ പരിഹരിച്ചു?",
    "എന്തെങ്കിലും achievements ഉണ്ടോ?",
    "ഏതെങ്കിലും clubs അല്ലെങ്കിൽ extracurricular activities-ൽ ഉണ്ടോ?",
    "നിങ്ങളുടെ soft skills എന്തെല്ലാം?",
    "നിങ്ങൾ സംസാരിക്കുന്ന ഭാഷകൾ ഏതെല്ലാം?",
  ],
  'bn-IN': [
    "আপনার পূর্ণ নাম এবং আপনি যে শহরে থাকেন তা বলুন।",
    "আপনি কোন course এবং কোন college-এ পড়ছেন? কোন year এবং CGPA বলুন।",
    "আপনার school background বলুন — 10th school, year, percentage এবং 12th college, year, percentage।",
    "আপনার phone number, email এবং LinkedIn বা GitHub link বলুন।",
    "আপনার technical skills কী কী?",
    "আপনার তৈরি একটি project-এর নাম, সেটি কী করে, কোন technologies ব্যবহার করেছেন?",
    "কোনো certifications আছে কি?",
    "আপনার career goal কী?",
    "একটি চ্যালেঞ্জ এবং কীভাবে সমাধান করলেন বলুন।",
    "কোনো achievements আছে কি?",
    "কোনো clubs বা extracurricular activities-এ আছেন কি?",
    "আপনার soft skills কী কী?",
    "আপনি কোন ভাষাগুলো বলতে পারেন?",
  ],
};

const QUESTION_KEYS = [
  'nameAndCity', 'courseAndCollege', 'schoolBackground', 'contactAndLinks',
  'technicalSkills', 'projects', 'certifications', 'careerGoals',
  'challenge', 'achievements', 'extracurriculars', 'softSkills', 'languages',
];

const BADGES = [
  '👤 PERSONAL', '🎓 EDUCATION', '🏫 SCHOOL HISTORY', '📞 CONTACT & LINKS',
  '💻 TECHNICAL SKILLS', '🛠 PROJECTS', '📜 CERTIFICATIONS', '🎯 CAREER GOALS',
  '💡 PROBLEM SOLVING', '🏆 ACHIEVEMENTS', '🎭 EXTRACURRICULARS',
  '🤝 SOFT SKILLS', '🗣 LANGUAGES',
];

// ─── FIX 1: Detect best supported MIME type for this device ───────────────
// iOS Safari only supports audio/mp4. Android Chrome supports audio/webm.
function getSupportedMimeType() {
  const types = [
    'audio/mp4',                 // iOS Safari — must be tried FIRST
    'audio/webm;codecs=opus',    // Android Chrome, Desktop Chrome
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}

function getFileExtension(mimeType) {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
}

export default function Interview() {
  const [selectedLang, setSelectedLang] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const langRef = useRef(null);
  // FIX 2: Store the chosen mimeType so blob creation uses the same type
  const mimeTypeRef = useRef('');

  const nav = useNavigate();
  const questions = selectedLang ? (QUESTIONS[selectedLang.code] || QUESTIONS['en-IN']) : [];

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];

    // FIX 3: getUserMedia must be called synchronously inside the click handler
    // on iOS. We keep this function async but it must be triggered directly
    // from a user gesture (onClick), which React ensures.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // FIX 4: These constraints help mobile get better audio quality
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      // FIX 5: Do NOT use timesliced recording (no argument to .start())
      // on mobile. Instead collect all data in one chunk on stop.
      // This fixes the iOS issue where ondataavailable fires unreliably.
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // FIX 6: Use a Promise to ensure ondataavailable fires BEFORE we
      // call transcribeAudio. On mobile, onstop can fire before the last
      // ondataavailable chunk arrives.
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        // Small delay to ensure the last ondataavailable chunk is collected
        setTimeout(() => {
          transcribeAudio();
        }, 300);
      };

      // FIX 7: Start without timeslicing — mobile collects one blob on stop
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          if (t >= 119) {
            stopRecording();
            return 120;
          }
          return t + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Mic error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('🔒 Microphone permission denied. Please allow mic access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('🎤 No microphone found on this device.');
      } else if (err.name === 'NotSupportedError') {
        setError('⚠️ Your browser does not support audio recording. Try Chrome or Safari.');
      } else {
        setError(`⚠️ Cannot access microphone: ${err.message}. Make sure no other app is using it.`);
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      // FIX 8: requestData() forces a final ondataavailable event before stop
      // This is critical on some Android browsers that may not flush the buffer
      try {
        mediaRecorderRef.current.requestData();
      } catch (e) {
        // requestData() not supported on all browsers — safe to ignore
      }
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAudio = async () => {
    if (chunksRef.current.length === 0) {
      setError('⚠️ No audio recorded. Please try again and speak clearly after tapping the mic.');
      return;
    }

    setTranscribing(true);
    setError(null);

    try {
      // FIX 9: Use the stored mimeType (from when recording started) for the blob
      const mimeType = mimeTypeRef.current || 'audio/webm';
      const ext = getFileExtension(mimeType);
      const audioBlob = new Blob(chunksRef.current, { type: mimeType });

      // FIX 10: Validate blob size — if < 1KB something went wrong
      if (audioBlob.size < 1000) {
        setError('⚠️ Recording was too short or silent. Please speak for at least 1–2 seconds.');
        setTranscribing(false);
        chunksRef.current = [];
        return;
      }

      const formData = new FormData();
      formData.append('file', audioBlob, `recording.${ext}`);
      formData.append('model', 'whisper-large-v3');
      formData.append('language', langRef.current?.whisper || 'en');
      formData.append('response_format', 'json');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const transcript = data.text?.trim();

      if (transcript) {
        setCurrent(prev => prev ? prev + ' ' + transcript : transcript);
      } else {
        setError('⚠️ No speech detected. Please try again and speak clearly into the mic.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError(`❌ Transcription failed: ${err.message}`);
    } finally {
      setTranscribing(false);
      chunksRef.current = [];
    }
  };

  const next = () => {
    const text = current.trim();
    if (!text) { alert('Please give an answer first!'); return; }
    if (recording) stopRecording();

    const updated = [
      ...answers,
      { question: questions[step], answer: text, key: QUESTION_KEYS[step] },
    ];
    setAnswers(updated);
    setCurrent('');
    setError(null);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      localStorage.setItem('voicecv_answers', JSON.stringify(updated));
      localStorage.setItem('voicecv_lang', selectedLang.label);
      nav('/resume');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ─── Language selection ───────────────────────────────────────────────────
  if (!selectedLang) {
    return (
      <div style={{
        maxWidth: '520px', margin: '60px auto', padding: '0 20px',
        fontFamily: "'Segoe UI', sans-serif", textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌐</div>
        <h2 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.6rem' }}>
          Choose Your Language
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '8px', lineHeight: 1.6 }}>
          Pick the language you're most comfortable speaking in.<br />
          Your resume will always be generated in English.
        </p>
        <p style={{ color: '#6366f1', fontSize: '0.85rem', marginBottom: '24px', fontWeight: '600' }}>
          🎙 Voice works on ALL devices — phone, tablet, laptop!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { langRef.current = lang; setSelectedLang(lang); }}
              style={{
                padding: '16px', borderRadius: '12px', border: '1.5px solid #e5e7eb',
                background: 'white', cursor: 'pointer', fontSize: '1rem',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Interview screen ─────────────────────────────────────────────────────
  const progressPct = ((step + 1) / questions.length) * 100;

  return (
    <div style={{
      maxWidth: '640px', margin: '50px auto', padding: '0 20px',
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p style={{ color: '#6366f1', fontWeight: 'bold', margin: 0 }}>
          Question {step + 1} of {questions.length}
        </p>
        <span style={{
          background: '#eef2ff', color: '#6366f1',
          padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
        }}>
          🌐 {selectedLang.label}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', marginBottom: '28px' }}>
        <div style={{
          background: 'linear-gradient(90deg,#6366f1,#818cf8)',
          width: `${progressPct}%`, height: '8px', borderRadius: '10px', transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Badge */}
      <div style={{
        display: 'inline-block', background: '#f0fdf4', color: '#16a34a',
        padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', marginBottom: '10px',
      }}>
        {BADGES[step]}
      </div>

      {/* Question */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937', lineHeight: 1.5 }}>
        {questions[step]}
      </h2>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px',
          padding: '12px 14px', marginBottom: '14px', color: '#b91c1c', fontSize: '0.88rem', lineHeight: 1.6,
        }}>
          {error}
        </div>
      )}

      {/* Recording indicator */}
      {recording && (
        <div style={{
          background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }}>
            🔴 Recording... speak now
          </span>
          <span style={{
            background: '#ef4444', color: 'white',
            padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700',
          }}>
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Transcribing indicator */}
      {transcribing && (
        <div style={{
          background: '#eef2ff', border: '2px solid #6366f1', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '12px', textAlign: 'center',
          color: '#6366f1', fontSize: '0.9rem', fontWeight: '600',
        }}>
          ⏳ Converting your speech to text...
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={current}
        onChange={e => setCurrent(e.target.value)}
        placeholder="Tap the mic button below to speak, or type here directly..."
        rows={5}
        style={{
          width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '10px',
          border: recording ? '2px solid #ef4444' : '1.5px solid #d1d5db',
          resize: 'vertical', boxSizing: 'border-box', outline: 'none',
          fontFamily: 'inherit', lineHeight: 1.6,
        }}
      />

      {/* Big mic button */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 8px' }}>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={transcribing}
          style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: 'none', cursor: transcribing ? 'not-allowed' : 'pointer',
            fontSize: '1.8rem',
            background: recording
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : transcribing
              ? '#e5e7eb'
              : 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: 'white',
            boxShadow: recording
              ? '0 0 0 8px rgba(239,68,68,0.2)'
              : '0 4px 14px rgba(99,102,241,0.4)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            // FIX 11: Prevent iOS double-tap zoom on the button
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {transcribing ? '⏳' : recording ? '⏹' : '🎙'}
        </button>
      </div>

      <p style={{ color: '#9ca3af', fontSize: '0.82rem', textAlign: 'center', marginBottom: '16px' }}>
        {transcribing
          ? 'Please wait, converting speech...'
          : recording
          ? 'Tap ⏹ to stop recording'
          : '🎙 Tap mic → speak → tap again to stop • Or type above'}
      </p>

      {current && !recording && !transcribing && (
        <p style={{ color: '#6366f1', fontSize: '0.8rem', textAlign: 'center', marginBottom: '8px' }}>
          💡 Tap mic again to add more, or edit the text above
        </p>
      )}

      {/* Next button */}
      <button
        onClick={next}
        disabled={recording || transcribing}
        style={{
          background: (recording || transcribing) ? '#e5e7eb' : '#6366f1',
          color: (recording || transcribing) ? '#9ca3af' : 'white',
          border: 'none', padding: '14px 32px', borderRadius: '10px',
          cursor: (recording || transcribing) ? 'not-allowed' : 'pointer',
          fontSize: '1rem', width: '100%', fontWeight: '600', marginTop: '4px',
          touchAction: 'manipulation',
        }}
      >
        {step + 1 === questions.length ? '✨ Generate My Resume →' : 'Next Question →'}
      </button>

      {/* Completed answers log */}
      {answers.length > 0 && (
        <div style={{
          marginTop: '28px', background: '#f9fafb', borderRadius: '10px',
          padding: '14px', border: '1px solid #e5e7eb',
        }}>
          <p style={{ margin: '0 0 10px', color: '#6b7280', fontSize: '0.82rem', fontWeight: '600' }}>
            ✅ COMPLETED ({answers.length}/{questions.length})
          </p>
          {answers.map((a, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: '600' }}>Q{i + 1}: </span>
              <span style={{ color: '#374151', fontSize: '0.8rem' }}>
                {a.answer.length > 60 ? a.answer.slice(0, 60) + '…' : a.answer}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}