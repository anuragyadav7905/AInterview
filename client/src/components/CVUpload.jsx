import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

/**
 * CVUpload Component
 * "Neon Luminary" Design System - Antigravity Effect
 */
const CVUpload = ({ onUploadSuccess }) => {
  // states: 'idle', 'uploading', 'success'
  const [state, setState] = useState('idle');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Particles for antigravity effect
  const [particles] = useState(() => 
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 80 + 10}%`,
      bottom: `${Math.random() * 20}%`,
      size: Math.random() * 8 + 4, // Int value for SVG size
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }))
  );

  const triggerError = useCallback((msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== 'idle') return;
    setIsDragOver(true);
  }, [state]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExts = ['.pdf', '.doc', '.docx'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(selectedFile.type) && !validExts.includes(ext)) {
      triggerError('Invalid format. Please upload PDF or DOCX.');
      return false;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      triggerError('File is too large. Max size is 5MB.');
      return false;
    }
    
    return true;
  };

  const processFile = (selectedFile) => {
    if (!validateFile(selectedFile)) return;
    
    setError('');
    setFile(selectedFile);
    startUpload(selectedFile);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (state !== 'idle') return;
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  }, [state]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const startUpload = (selectedFile) => {
    setState('uploading');
    setProgress(0);
    
    // Simulate initial progress
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(intervalId);
          return 95; // Wait for real API
        }
        return prev + 5;
      });
    }, 100);

    // Call real API
    performRealUpload(selectedFile, intervalId);
  };

  const performRealUpload = async (selectedFile, intervalId) => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');

      const response = await axios.post('/api/upload-cv', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const structured = response.data.structuredData || {};
      const returnedCvId = response.data._id;

      // Parse skills string into array for display (e.g. "React, Node.js\nPython" → ["React", "Node.js", "Python"])
      let skillsArray = [];
      if (structured.skills) {
        skillsArray = structured.skills
          .split(/[\n,]+/)
          .map(s => s.trim())
          .filter(s => s.length > 0 && s.length < 40)
          .slice(0, 8);
      }

      // Simple ATS score: base 60 + bonus for each section present
      const atsScore = 60
        + (structured.name ? 5 : 0)
        + (structured.email ? 5 : 0)
        + (structured.skills ? 10 : 0)
        + (structured.experience ? 10 : 0)
        + (structured.education ? 5 : 0)
        + (structured.projects ? 5 : 0);

      const resData = {
        name: structured.name || response.data.fileName,
        email: structured.email || '',
        phone: structured.phone || '',
        skills: skillsArray.length > 0 ? skillsArray : ['See full CV'],
        atsScore
      };
      
      setTimeout(() => {
        clearInterval(intervalId);
        setProgress(100);
        
        setTimeout(() => {
          setParsedData(resData);
          setState('success');
          if (onUploadSuccess) onUploadSuccess({ ...resData, id: returnedCvId });
        }, 500); // Small delay to show 100%
      }, 1000); // Simulate network latency

    } catch (err) {
      clearInterval(intervalId);
      triggerError('Upload failed. Please try again.');
      setState('idle');
      setFile(null);
    }
  };

  const handleBrowseClick = (e) => {
    // Ripple effect
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = btn.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    btn.appendChild(circle);
    
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setState('idle');
    setFile(null);
    setParsedData(null);
    setProgress(0);
    setError('');
  };

  const isPDF = file?.name?.toLowerCase().endsWith('.pdf');

  return (
    <>
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px 0px rgba(224, 142, 254, 0.1); }
          50% { box-shadow: 0 0 40px 10px rgba(224, 142, 254, 0.3); }
        }
        @keyframes rotateGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
        @keyframes drawCheck {
          0% { stroke-dashoffset: 166; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawCheckPath {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes shimmerBg {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes shakeContent {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUpStagger {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes rippleEffect {
          to { transform: scale(4); opacity: 0; }
        }

        .cv-upload-wrapper {
          --primary: #e08efe;
          --secondary: #8995ff;
          --tertiary: #ff84aa;
          --bg-dark: #0a0e14;
          --error: #ff5252;
          --success: #4cd964;
          
          font-family: var(--font-body, 'Inter', sans-serif);
          color: #fff;
          width: 100%;
          max-width: 600px;
          margin: 40px auto;
          position: relative;
          border-radius: 24px;
          background: var(--surface-container-highest, rgba(30, 34, 45, 0.5));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: floatCard 4s ease-in-out infinite;
          padding: 24px;
        }

        .cv-upload-wrapper.is-drag-over {
          transform: scale(1.03);
          border-color: rgba(224, 142, 254, 0.3);
        }

        .cv-upload-wrapper.shake {
          animation: shakeContent 0.4s ease-in-out;
        }

        .drop-zone-area {
          position: relative;
          width: 100%;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: radial-gradient(circle at center, rgba(224,142,254,0.03) 0%, transparent 70%);
          transition: all 0.3s ease;
          animation: pulseGlow 3s infinite;
          padding: 30px;
          z-index: 1;
        }

        /* Rotating Dashed Aurora Border */
        .drop-zone-area::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          padding: 2px;
          background: conic-gradient(from 0deg, var(--primary), var(--secondary), var(--tertiary), var(--primary));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotateGradient 4s linear infinite;
          pointer-events: none;
          opacity: 0.6;
          /* Dashed effect trick by combining mask */
        }
        
        .drop-zone-area::after {
          /* Add a dashed border overlay if we want absolute dashes */
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 2px dashed var(--bg-dark);
          pointer-events: none;
        }

        .is-drag-over .drop-zone-area {
          background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(224,142,254,0.1) 50%, transparent 100%);
          box-shadow: 0 0 50px 10px rgba(224, 142, 254, 0.4);
        }
        
        .is-drag-over .drop-zone-area::before {
          opacity: 1;
          animation: rotateGradient 1.5s linear infinite;
        }

        .drop-zone-area.state-error::before {
          background: var(--error);
          animation: none;
        }

        .drop-zone-area.state-error {
          box-shadow: 0 0 30px 5px rgba(255, 82, 82, 0.2);
        }

        .drop-zone-area.state-uploading::before {
          background: rgba(137, 149, 255, 0.4);
          animation: none;
        }

        .drop-zone-area.state-uploading {
          background: linear-gradient(90deg, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.01) 75%);
          background-size: 200% 100%;
          animation: shimmerBg 2s infinite linear;
        }

        .drop-zone-area.state-success::before {
          background: linear-gradient(135deg, var(--success), var(--primary));
          animation: none;
          opacity: 1;
        }
        
        .drop-zone-area.state-success::after {
          display: none; /* No dashes on success state */
        }

        .drop-zone-area.state-success {
          animation: none;
          box-shadow: 0 0 40px 5px rgba(76, 217, 100, 0.1);
        }

        .particle-dot {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
          filter: drop-shadow(0 0 6px var(--primary));
        }

        .cv-header-text {
          font-family: var(--font-display, 'Manrope', sans-serif);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 16px 0 8px;
          text-align: center;
          color: #fff;
          z-index: 2;
        }

        .is-drag-over .cv-header-text {
          color: var(--primary);
        }

        .cv-sub-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 24px;
          text-align: center;
          z-index: 2;
        }

        .cv-btn-browse {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: #fff;
          border: none;
          padding: 12px 36px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(224, 142, 254, 0.3);
          z-index: 2;
        }

        .cv-btn-browse:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(224, 142, 254, 0.5);
        }

        .ripple {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleEffect 0.6s linear;
          pointer-events: none;
        }

        .cv-error-msg {
          color: var(--error);
          font-size: 0.9rem;
          margin-top: 16px;
          background: rgba(255, 82, 82, 0.1);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 82, 82, 0.3);
          z-index: 2;
          animation: popIn 0.3s ease;
        }

        /* Icons */
        .cv-cloud-icon {
          width: 72px;
          height: 72px;
          fill: none;
          stroke: url(#gradient-primary);
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .is-drag-over .cv-cloud-icon {
          transform: translateY(-10px) scale(1.1);
          stroke: #fff;
          filter: drop-shadow(0 0 12px var(--primary));
        }

        /* Uploading progress */
        .cv-progress-container {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          z-index: 2;
        }

        .cv-progress-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          position: absolute;
        }

        .cv-progress-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.05);
          stroke-width: 4;
        }

        .cv-progress-bar {
          fill: none;
          stroke: url(#gradient-secondary);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 264;
          transition: stroke-dashoffset 0.1s linear;
          filter: drop-shadow(0 0 6px rgba(137, 149, 255, 0.8));
        }

        .cv-progress-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          font-family: var(--font-display, 'Manrope', sans-serif);
        }

        .cv-file-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 2;
          max-width: 100%;
        }

        .cv-file-name {
          font-size: 0.95rem;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .cv-file-icon {
          width: 20px;
          height: 20px;
        }

        /* Success Card */
        .cv-success-content {
          width: 100%;
          z-index: 2;
        }

        .cv-success-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .cv-candidate-name {
          font-family: var(--font-display, 'Manrope', sans-serif);
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #fff, var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cv-contact-info {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin: 4px 0 24px 0;
        }

        .cv-ats-box {
          position: relative;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cv-ats-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .cv-ats-score {
          font-size: 1.2rem;
          font-weight: 800;
          color: #fff;
        }

        .cv-ats-label {
          position: absolute;
          bottom: -18px;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
          white-space: nowrap;
        }

        .cv-skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }

        .cv-skill-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #fff;
          opacity: 0;
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .cv-actions {
          display: flex;
          gap: 12px;
          opacity: 0;
          animation: fadeUpStagger 0.5s ease-out forwards;
          animation-delay: 0.6s;
        }

        .cv-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .cv-btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cv-btn-primary:hover, .cv-btn-secondary:hover {
          transform: translateY(-2px);
        }
        .cv-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.4);
        }

        .cv-success-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }
        .cv-success-circle {
          fill: none;
          stroke: var(--success);
          stroke-width: 3;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: drawCheck 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          filter: drop-shadow(0 0 6px rgba(76, 217, 100, 0.4));
        }
        .cv-success-path {
          fill: none;
          stroke: var(--success);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheckPath 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          animation-delay: 0.5s;
        }
      `}</style>

      {/* Shared SVGs for gradients */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e08efe" />
            <stop offset="100%" stopColor="#8995ff" />
          </linearGradient>
          <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8995ff" />
            <stop offset="100%" stopColor="#e08efe" />
          </linearGradient>
          <linearGradient id="gradient-ats" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff84aa" />
            <stop offset="50%" stopColor="#e08efe" />
            <stop offset="100%" stopColor="#8995ff" />
          </linearGradient>
        </defs>
      </svg>

      <div 
        className={`cv-upload-wrapper ${isDragOver ? 'is-drag-over' : ''} ${shake ? 'shake' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`drop-zone-area state-${state} ${error ? 'state-error' : ''}`}>
          
          {/* Antigravity Particles */}
          {state === 'idle' && particles.map(p => (
            <svg 
              key={p.id} 
              className="particle-dot"
              viewBox="0 0 10 10"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: `particleFloat ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay
              }}
            >
              <circle cx="5" cy="5" r="5" fill="var(--primary)" />
            </svg>
          ))}

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            style={{ display: 'none' }} 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />

          {/* Idle / DragOver State */}
          {state === 'idle' && (
            <>
              <svg className="cv-cloud-icon" viewBox="0 0 24 24">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                <path d="M12 15V8" />
                <path d="m9 11 3-3 3 3" />
              </svg>
              <h2 className="cv-header-text">
                {isDragOver ? 'Release to upload' : 'Drop your resume here'}
              </h2>
              <p className="cv-sub-text">PDF or DOCX • Max 5MB</p>
              
              <button className="cv-btn-browse" onClick={handleBrowseClick}>
                Browse Files
              </button>

              {error && <div className="cv-error-msg">{error}</div>}
            </>
          )}

          {/* Uploading State */}
          {state === 'uploading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUpStagger 0.4s easeOut' }}>
              <div className="cv-progress-container">
                <svg className="cv-progress-svg" viewBox="0 0 90 90">
                  <circle className="cv-progress-bg" cx="45" cy="45" r="42" />
                  <circle 
                    className="cv-progress-bar" 
                    cx="45" 
                    cy="45" 
                    r="42" 
                    style={{ strokeDashoffset: 264 - (264 * progress) / 100 }}
                  />
                </svg>
                <div className="cv-progress-text">{progress}%</div>
              </div>
              
              <div className="cv-file-badge">
                <svg className="cv-file-icon" viewBox="0 0 24 24" fill="none" stroke={isPDF ? "#ff5252" : "#8995ff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="cv-file-name">{file?.name}</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && parsedData && (
            <div className="cv-success-content">
              <div style={{ animation: 'fadeUpStagger 0.4s ease-out' }}>
                <svg className="cv-success-icon" viewBox="0 0 54 54">
                  <circle className="cv-success-circle" cx="27" cy="27" r="25" />
                  <path className="cv-success-path" d="M15 27l8 8 16-16" />
                </svg>
              </div>

              <div className="cv-success-header" style={{ animation: 'fadeUpStagger 0.4s ease-out', animationDelay: '0.1s' }}>
                <div>
                  <h3 className="cv-candidate-name">{parsedData.name}</h3>
                  <p className="cv-contact-info">{parsedData.email} • {parsedData.phone}</p>
                </div>
                
                <div className="cv-ats-box">
                  <svg className="cv-ats-svg" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="url(#gradient-ats)" 
                      strokeWidth="3"
                      strokeDasharray="100" 
                      strokeDashoffset={100 - parsedData.atsScore} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="cv-ats-score">{parsedData.atsScore}%</span>
                  <span className="cv-ats-label">ATS Match</span>
                </div>
              </div>

              <div className="cv-skills-row">
                {parsedData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="cv-skill-chip"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="cv-actions">
                <button className="cv-btn-primary">Start Interview</button>
                <button className="cv-btn-secondary" onClick={resetUpload}>Re-upload</button>
                <button className="cv-btn-secondary">View Parsed Data</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CVUpload;
