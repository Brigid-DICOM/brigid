import { Gif } from '@remotion/gif';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const FeatureItem = ({
  title,
  description,
  startFrame,
  gifSrc,
}: {
  title: string;
  description: string;
  startFrame: number;
  gifSrc?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  // Exit animation (fade out in the last 15 frames)
  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = entrance * exit;
  const translate = interpolate(entrance, [0, 1], [40, 0]);

  return (
    <div style={{ 
      opacity, 
      display: 'flex',
      flexDirection: 'column',
      gap: 50,
      alignItems: 'center',
      width: '100%'
    }}>
      {/* Text Content */}
      <div style={{ textAlign: 'center', transform: `translateY(${translate}px)` }}>
        <div style={{ 
          fontSize: 60, 
          fontWeight: 800, 
          color: '#f8fafc',
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24
        }}>
          <div style={{ width: 15, height: 60, backgroundColor: '#38bdf8', borderRadius: 8 }} />
          {title}
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8' }}>
          {description}
        </div>
      </div>
      
      {/* GIF Preview */}
      {gifSrc && (
        <div style={{ 
          width: '80%',
          maxWidth: 1200,
          borderRadius: 30,
          overflow: 'hidden',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 18px 36px -18px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: `scale(${interpolate(entrance, [0, 1], [0.95, 1])})`
        }}>
          <Gif 
            src={staticFile(gifSrc)} 
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
};