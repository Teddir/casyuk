import mascotVideo from '../assets/mascot/0629.mp4';
import aesthetic1 from '../assets/video_bank/aesthetic_1.mp4';
import angry1 from '../assets/video_bank/angry_1.mp4';
import panic1 from '../assets/video_bank/panic_1.mp4';

export const VIDEO_PACKS = [
  {
    packName: 'Default & Mascot',
    videos: [
      { id: 'default', name: 'Original CasYuk Mascot', src: mascotVideo }
    ]
  },
  {
    packName: 'Aesthetic & Chill',
    videos: [
      { id: 'aesthetic_1', name: 'Lofi Vibes', src: aesthetic1 }
    ]
  },
  {
    packName: 'Humor & Reaction',
    videos: [
      { id: 'angry_1', name: 'Angry Alert', src: angry1 },
      { id: 'panic_1', name: 'Panic Attack', src: panic1 }
    ]
  }
];

export function getBankVideoSrc(id: string): string | null {
  for (const pack of VIDEO_PACKS) {
    const video = pack.videos.find(v => v.id === id);
    if (video) return video.src;
  }
  return null;
}
