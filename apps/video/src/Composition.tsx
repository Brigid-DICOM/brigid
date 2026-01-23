import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FeatureItem } from './components/FeatureItem';

export type BrigidIntroProps = {
  title: string;
  subtitle: string;
};

export const BrigidIntro = ({ title, subtitle }: BrigidIntroProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle reveal animation for the logo
  const logoOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Timing constants (in seconds, multiplied by fps)
  const introDuration = 2 * fps;
  const featureDuration = 6.5 * fps;
  const feature3Duration = 8 * fps;
  const feature2Start = introDuration + featureDuration;
  const feature3Start = feature2Start + featureDuration;
  const outroStart = feature3Start + feature3Duration;
  
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#0f172a', color: 'white' }}>
      {/* Background decoration */}
      <div style={{ 
        position: 'absolute', top: -200, right: -200, width: 600, height: 600, 
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)' 
      }} />
      <div style={{ 
        position: 'absolute', bottom: -200, left: -200, width: 800, height: 800, 
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)' 
      }} />

      {/* 0-2s: Intro Logo */}
      <Sequence durationInFrames={introDuration}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ opacity: logoOpacity, transform: `scale(${0.8 + 0.2 * logoScale})` }}>
            <img src={staticFile('logo-banner.png')} style={{ width: 600 }} alt="Logo" />
          </div>
          <h1 style={{ 
            marginTop: 40, fontSize: 80, fontWeight: 800, opacity: logoOpacity,
            background: 'linear-gradient(to right, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {title}
          </h1>
        </AbsoluteFill>
      </Sequence>

      {/* 2-8.5s: Feature 1 */}
      <Sequence from={introDuration} durationInFrames={featureDuration}>
        <AbsoluteFill style={{ padding: 100, justifyContent: 'center' }}>
          <FeatureItem 
            title="Full DICOM Support" 
            description="DICOMweb & DIMSE services integration" 
            gifSrc="upload-dicom.gif"
            startFrame={0.5 * fps}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 8.5-15s: Feature 2 */}
      <Sequence from={feature2Start} durationInFrames={featureDuration}>
        <AbsoluteFill style={{ padding: 100, justifyContent: 'center' }}>
          <FeatureItem 
            title="Modern Web Viewer" 
            description="Smooth medical imaging experience with BlueLight" 
            gifSrc="dicom-viewer.gif"
            startFrame={0.5 * fps}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 15-23s: Feature 3 (Extended to 8s) */}
      <Sequence from={feature3Start} durationInFrames={feature3Duration}>
        <AbsoluteFill style={{ padding: 100, justifyContent: 'center' }}>
          <FeatureItem 
            title="Workspace Collaboration" 
            description="Share and manage studies across teams" 
            gifSrc="multi-workspaces.gif"
            startFrame={0.5 * fps}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={outroStart}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ 
            fontSize: 40, fontWeight: 500, 
            opacity: spring({ frame: frame - outroStart, fps, config: { damping: 200 } }) 
          }}>
            Try it now at
          </h3>
          <p style={{ 
            fontSize: 60, fontWeight: 700, color: '#38bdf8', marginTop: 20,
            opacity: spring({ frame: frame - (outroStart + 0.5 * fps), fps, config: { damping: 200 } })
          }}>
            github.com/Brigid-DICOM/brigid
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};