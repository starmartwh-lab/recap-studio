import { AbsoluteFill, Video, Audio, useVideoConfig, Sequence } from 'remotion';

export const RecapVideo = ({ segments }) => {
 const { fps } = useVideoConfig();

 let currentFrameOffset = 0;

 return (
  <AbsoluteFill style={{ backgroundColor: 'black' }}>
   {/* Master Voiceover Track */}
   <Audio src={require('./assets/voiceover.mp3')} />

   {/* Programmatically layout dynamic visual slices based on timestamps */}
   {segments.map((segment, index) => {
    const durationInFrames = segment.durationSeconds * fps;
    const startFrom = currentFrameOffset;
    currentFrameOffset += durationInFrames;

    return (
     <Sequence
      key={index}
      from={startFrom}
      durationInFrames={durationInFrames}
     >
      {/* Cut and slice specific parts of the downloaded trailer source file */}
      <Video
       src={require('./assets/raw_source.mp4')}
       startFrom={segment.clipStartFrame}
       endFrom={segment.clipEndFrame}
       muted
       style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Ensures automatic cropping for 9:16 TikTok canvas formats
       }}
      />
      {/* Kinetic burned-in text dynamic layer */}
      <div className="absolute bottom-20 left-10 right-10 text-center text-yellow-400 font-bold text-4xl stroke-black drop-shadow-md">
       {segment.text}
      </div>
     </Sequence>
    );
   })}
  </AbsoluteFill>
 );
};
