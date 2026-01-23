import { Composition } from 'remotion';
import { BrigidIntro, BrigidIntroProps } from './Composition';

export const RemotionRoot = () => {
  return (
      <Composition
        id="BrigidIntro"
        component={BrigidIntro}
        durationInFrames={780} // 26 seconds at 30fps
        fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Brigid",
        subtitle: "Open Source DICOM Platform",
      } satisfies BrigidIntroProps}
    />
  );
};
