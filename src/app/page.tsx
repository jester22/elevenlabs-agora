import VoiceComponent from "@/components/VoiceComponent";
import VideoComponent from "@/components/VideoComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-[100px] animate-pulse" />

      <small className="text-sm text-gray-500">Powered by ElevenLabs & Agora</small>
      <h1 className="text-4xl font-bold mb-6">Realtime Voice & Video Agent</h1>
      
      <div className="flex flex-col gap-8 items-center">
        <VideoComponent />
        <VoiceComponent />
      </div>
      
      <small className="text-xs text-gray-500 my-6">
        The app requires microphone and camera access to work.
      </small>
    </main>
  );
}
