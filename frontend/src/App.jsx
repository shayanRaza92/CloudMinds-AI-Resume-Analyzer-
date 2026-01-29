import { useState } from 'react';
import {
  Upload, FileText, TrendingUp, AlertCircle, CheckCircle, Brain,
  Award, Target, Zap, Menu, X, Mail, Linkedin, Github, MessageCircle,
  Home, Info, Phone
} from 'lucide-react';
import ScoreGauge from './components/ScoreGauge';
import SkillsRadar from './components/SkillsRadar';
import ProgressBar from './components/ProgressBar';
import './App.css';

const API_URL = "https://66lwe94pag.execute-api.us-east-1.amazonaws.com";

const CONTACT_INFO = {
  name: "Shayan Raza",
  email: "shayanraza2333@gmail.com",
  linkedin: "https://www.linkedin.com/in/shayan-raza-0402472a5/",
  github: "https://github.com/shayanRaza92",
  whatsapp: "923273628142",
  phone: "+92 327 3628142"
};

function App() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const uploadRes = await fetch(`${API_URL}/upload?fileName=${encodeURIComponent(file.name)}`);
      const uploadData = await uploadRes.json();

      if (!uploadData.uploadUrl || !uploadData.key) {
        throw new Error('Invalid upload response');
      }

      await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'application/pdf' }
      });

      const analyzeRes = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucket: uploadData.bucket,
          key: uploadData.key
        })
      });

      const result = await analyzeRes.json();

      if (result.success) {
        setAnalysis(result.analysis);
        setActiveSection('analyzer');
      } else {
        setError(result.error || 'Analysis failed');
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setAnalysis(null);
    setFile(null);
  };

  const renderNavigation = () => (
    <nav className="navbar glass-effect">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => scrollToSection('home')}>
          <Brain size={32} className="brand-icon" />
          <span className="brand-text">CloudMinds</span>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            className={activeSection === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </a>
          <a
            className={activeSection === 'about' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('about')}
          >
            <Info size={18} />
            <span>About</span>
          </a>
          <a
            className={activeSection === 'analyzer' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('analyzer')}
          >
            <Zap size={18} />
            <span>Analyzer</span>
          </a>
          <a
            className={activeSection === 'contact' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('contact')}
          >
            <Phone size={18} />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">Smart Resume Intelligence</div>
        <h1 className="hero-title">
          Land Your Dream Job with
          <span className="gradient-text"> AI-Driven Clarity</span>
        </h1>
        <p className="hero-description">
          Stop guessing why your resume isn't getting hits. Our AI deep-dives into your experience,
          highlighting exactly where you shine and where you can level up. It's not just a score;
          it's your personalized roadmap to a better career.
        </p>
        <div className="hero-buttons">
          <button className="hero-btn primary" onClick={() => scrollToSection('analyzer')}>
            <Zap size={20} />
            Start Analyzing
          </button>
          <button className="hero-btn secondary" onClick={() => scrollToSection('about')}>
            Why CloudMinds?
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Critical Metrics</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Groq</div>
            <div className="stat-label">Ultra-Fast AI</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Real</div>
            <div className="stat-label">Actionable Advice</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="about-section">
      <div className="about-container">
        <div className="section-header">
          <h2 className="section-title">Beyond Simple Scanning</h2>
          <p className="section-subtitle">We built CloudMinds to give every job seeker an unfair advantage.</p>
        </div>

        <div className="about-grid">
          <div className="about-card glass-effect">
            <div className="about-icon">
              <Brain size={40} />
            </div>
            <h3>Genuinely Smart Analysis</h3>
            <p>
              We don't just look for keywords. We use the latest Llama 3 models to understand
              the actual impact of your work, ensuring your contributions are seen.
            </p>
          </div>

          <div className="about-card glass-effect">
            <div className="about-icon">
              <Award size={40} />
            </div>
            <h3>Beat the Robots</h3>
            <p>
              ATS systems can be frustrating. We help you translate your human achievements
              into a format that machines love, without losing your personal touch.
            </p>
          </div>

          <div className="about-card glass-effect">
            <div className="about-icon">
              <Target size={40} />
            </div>
            <h3>Your Personal Editor</h3>
            <p>
              Ever wished an expert could look at your resume instantly? CloudMinds gives
              you that high-level feedback 24/7, pinpointing exactly what to change.
            </p>
          </div>
        </div>

        <div className="tech-stack glass-effect">
          <h3>The Tech Behind the Magic</h3>
          <div className="tech-badges">
            <span className="tech-badge">AWS Serverless</span>
            <span className="tech-badge">Groq Llama 3</span>
            <span className="tech-badge">Modern React</span>
            <span className="tech-badge">Edge Delivery</span>
            <span className="tech-badge">Secure S3 Storage</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="contact-section">
      <div className="contact-container">
        <div className="section-header">
          <h2 className="section-title">Let's Build Something Great</h2>
          <p className="section-subtitle">Have a question or want to collaborate? I'm just a click away.</p>
        </div>

        <div className="contact-grid">
          <a href={`mailto:${CONTACT_INFO.email}`} className="contact-card glass-effect no-underline">
            <div className="contact-info">
              <Mail className="contact-icon" size={32} />
              <h3>Email Me</h3>
              <span className="contact-link">{CONTACT_INFO.email}</span>
            </div>
          </a>

          <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card glass-effect no-underline">
            <div className="contact-info">
              <Linkedin className="contact-icon linkedin" size={32} />
              <h3>LinkedIn</h3>
              <span className="contact-link">Connect & Network</span>
            </div>
          </a>

          <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer" className="contact-card glass-effect no-underline">
            <div className="contact-info">
              <Github className="contact-icon github" size={32} />
              <h3>GitHub</h3>
              <span className="contact-link">Check My Code</span>
            </div>
          </a>

          <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-card glass-effect no-underline">
            <div className="contact-info">
              <MessageCircle className="contact-icon whatsapp" size={32} />
              <h3>WhatsApp</h3>
              <span className="contact-link">Text Me Directly</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );


  const renderAnalyzer = () => (
    !analysis ? (
      <div className="upload-section">
        <div className="upload-card glass-effect">
          <div className="upload-icon-wrapper">
            <FileText size={80} className="upload-icon floating" />
            <div className="icon-glow"></div>
          </div>
          <h2 className="upload-title">Upload Your Resume</h2>
          <p className="upload-description">
            Get instant AI-powered analysis with detailed insights and actionable recommendations
          </p>

          <label htmlFor="file-upload" className="file-label glass-button">
            <Upload size={20} />
            <span>{file ? file.name : 'Choose PDF File'}</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {file && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="analyze-btn gradient-button"
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Analyze Resume
                </>
              )}
            </button>
          )}

          {error && (
            <div className="error-message slide-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="features-grid">
            <div className="feature-item">
              <Award size={24} />
              <span>ATS Score</span>
            </div>
            <div className="feature-item">
              <Target size={24} />
              <span>Skills Analysis</span>
            </div>
            <div className="feature-item">
              <TrendingUp size={24} />
              <span>Improvements</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="dashboard fade-in">
        <button
          onClick={() => { setAnalysis(null); setFile(null); }}
          className="back-btn glass-button"
        >
          ← Analyze Another Resume
        </button>

        <div className="stats-overview">
          <div className="stat-card glass-effect">
            <ScoreGauge
              score={analysis.overallScore}
              label="Overall Score"
              color="#667eea"
            />
          </div>
          <div className="stat-card glass-effect">
            <ScoreGauge
              score={analysis.atsScore}
              label="ATS Compatible"
              color="#10b981"
            />
          </div>
          <div className="stat-card glass-effect experience-card">
            <div className="experience-level">
              <TrendingUp size={32} className="exp-icon" />
              <div>
                <h3>Experience Level</h3>
                <div className="experience-badge">{analysis.experienceLevel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card glass-effect slide-in-up">
          <div className="card-header">
            <Brain size={24} />
            <h3>AI Summary</h3>
          </div>
          <p className="summary-text">{analysis.summary}</p>
        </div>

        <div className="two-column-grid">
          <div className="skills-card glass-effect slide-in-left">
            <div className="card-header">
              <Zap size={24} />
              <h3>Skills Profile</h3>
            </div>
            <SkillsRadar skills={analysis.skills} />
            <div className="skills-tags">
              {analysis.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag pulse-animation" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="metrics-column">
            <div className="metrics-card glass-effect slide-in-right">
              <div className="card-header">
                <CheckCircle size={24} />
                <h3>Key Strengths</h3>
              </div>
              <div className="metrics-list">
                {analysis.strengths.map((strength, idx) => (
                  <ProgressBar
                    key={idx}
                    label={strength}
                    value={8 + Math.floor(Math.random() * 2)}
                    color="#10b981"
                    delay={idx * 200}
                  />
                ))}
              </div>
            </div>

            <div className="metrics-card glass-effect slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="card-header">
                <AlertCircle size={24} />
                <h3>Areas to Improve</h3>
              </div>
              <div className="metrics-list">
                {analysis.weaknesses.map((weakness, idx) => (
                  <ProgressBar
                    key={idx}
                    label={weakness}
                    value={4 + Math.floor(Math.random() * 3)}
                    color="#f59e0b"
                    delay={idx * 200 + 400}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="recommendations-card glass-effect slide-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <Target size={24} />
            <h3>Expert Recommendations</h3>
          </div>
          <div className="recommendations-grid">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="recommendation-item" style={{ animationDelay: `${idx * 0.1 + 0.5}s` }}>
                <div className="recommendation-number">{idx + 1}</div>
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="app">
      <div className="background-gradient"></div>
      <div className="background-mesh"></div>

      {renderNavigation()}

      <main className="main-content">
        {activeSection === 'home' && renderHome()}
        {activeSection === 'about' && renderAbout()}
        {activeSection === 'analyzer' && renderAnalyzer()}
        {activeSection === 'contact' && renderContact()}
      </main>

      <footer className="footer">
        <p>CloudMinds 2026 copyrights reserved</p>
      </footer>
    </div>
  );
}

export default App;
