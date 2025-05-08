'use client';

import { useEffect, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

const VideoComponent = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  // Replace these with your Agora App ID and channel name
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
  const channelName = 'test-channel';

  useEffect(() => {
    const init = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);

      // Handle user published events
      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers((prev) => [...prev, user]);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      // Handle user left events
      agoraClient.on('user-unpublished', (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      try {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks([audioTrack, videoTrack]);
        
        await agoraClient.join(appId, channelName, null, null);
        await agoraClient.publish([audioTrack, videoTrack]);
      } catch (error) {
        console.error('Error initializing video:', error);
      }
    };

    init();

    return () => {
      localTracks?.[0].close();
      localTracks?.[1].close();
      client?.leave();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Local video */}
        <div className="w-[400px] h-[300px] bg-gray-800 rounded-lg overflow-hidden">
          {localTracks && (
            <div
              ref={(el) => {
                if (el) {
                  localTracks[1].play(el);
                }
              }}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Remote videos */}
        {remoteUsers.map((user) => (
          <div key={user.uid} className="w-[400px] h-[300px] bg-gray-800 rounded-lg overflow-hidden">
            <div
              ref={(el) => {
                if (el) {
                  user.videoTrack?.play(el);
                }
              }}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComponent; 