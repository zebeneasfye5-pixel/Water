import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Mic, Upload, X, Play, Square, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MediaCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onMediaCaptured: (media: {
    photoUrl?: string;
    videoUrl?: string;
    audioVoiceUrl?: string;
  }) => void;
  initialMedia?: {
    photoUrl?: string;
    videoUrl?: string;
    audioVoiceUrl?: string;
  };
}

export const MediaCaptureModal: React.FC<MediaCaptureModalProps> = ({
  isOpen,
  onClose,
  lang,
  onMediaCaptured,
  initialMedia
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'audio'>('camera');
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');

  // Stream & Recording state
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoTimer, setVideoTimer] = useState(0);

  // Result media state
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(initialMedia?.photoUrl);
  const [videoPreview, setVideoPreview] = useState<string | undefined>(initialMedia?.videoUrl);
  const [audioPreview, setAudioPreview] = useState<string | undefined>(initialMedia?.audioVoiceUrl);

  // Audio recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTimer, setAudioTimer] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, activeTab, captureMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: captureMode === 'video'
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access could not be initialized:', err);
      setCameraError(
        lang === 'am' 
          ? 'ካሜራውን መክፈት አልተቻለም (ፍቃድ አልተሰጠም ወይም ካሜራ የለም)። እባክዎ ፋይል ያያይዙ ወይም ከታች ያሉትን ናሙናዎች ይጠቀሙ።'
          : 'Could not access camera. Please check permissions or upload a file directly.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (isRecordingVideo) {
      stopVideoRecording();
    }
  };

  // Live Photo Snap
  const takePhotoSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoPreview(dataUrl);
    }
  };

  // Live Video Record
  const startVideoRecording = () => {
    if (!stream) return;
    videoChunksRef.current = [];
    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setVideoPreview(videoUrl);
      };
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      setVideoTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setVideoTimer(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.error('Error starting video recording', e);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Audio Voice Memo Recording
  const startAudioRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(audioStream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioPreview(audioUrl);
        audioStream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      audioRecorderRef.current = recorder;
      setIsRecordingAudio(true);
      setAudioTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setAudioTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Audio recording failed', err);
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // File Upload Handlers
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Realistic sample injection for testing without live camera
  const useSampleMedia = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80');
    setVideoPreview('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  };

  const handleConfirmAndSave = () => {
    onMediaCaptured({
      photoUrl: photoPreview,
      videoUrl: videoPreview,
      audioVoiceUrl: audioPreview
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'am' ? 'የብልሽት ፎቶና ቪዲዮ መቅረጫ / ማያያዣ' : 'Incident Photo & Video Capture'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'am'
                ? 'በቀጥታ ካሜራ በመጠቀም ወይም ፋይል በማያያዝ የውሃውን ችግር ያሳዩ'
                : 'Use live camera recording or upload media files directly'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'camera'
                ? 'bg-white text-cyan-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            {lang === 'am' ? 'ቀጥታ ካሜራ (Live Camera)' : 'Live Camera'}
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'upload'
                ? 'bg-white text-cyan-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            {lang === 'am' ? 'ፋይል አያይዝ (Upload File)' : 'Upload Files'}
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'audio'
                ? 'bg-white text-cyan-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            {lang === 'am' ? 'የድምፅ ገለፃ (Voice Memo)' : 'Voice Memo'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: LIVE CAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {lang === 'am' ? 'የመቅረጫ አይነት:' : 'Capture Mode:'}
                  </span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => {
                        setCaptureMode('photo');
                        if (isRecordingVideo) stopVideoRecording();
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        captureMode === 'photo'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      {lang === 'am' ? 'ፎቶ (Photo)' : 'Photo'}
                    </button>
                    <button
                      onClick={() => setCaptureMode('video')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        captureMode === 'video'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      {lang === 'am' ? 'ቪዲዮ (Video)' : 'Video'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={useSampleMedia}
                  className="text-xs text-cyan-700 hover:text-cyan-800 font-medium underline"
                >
                  {lang === 'am' ? 'የናሙና ቪዲዮ/ፎቶ ተጠቀም' : 'Use Sample Footage'}
                </button>
              </div>

              {/* Camera Viewport or Error */}
              {cameraError ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>{cameraError}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={startCamera}
                        className="px-3 py-1.5 bg-amber-200 text-amber-900 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {lang === 'am' ? 'እንደገና ሞክር' : 'Retry Camera'}
                      </button>
                      <button
                        onClick={useSampleMedia}
                        className="px-3 py-1.5 bg-cyan-700 text-white rounded-lg text-xs font-medium"
                      >
                        {lang === 'am' ? 'የተዘጋጀ ናሙና ቪዲዮ/ፎቶ ጫን' : 'Load Demo Leak Media'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Recording indicator */}
                  {isRecordingVideo && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      REC 00:{videoTimer < 10 ? `0${videoTimer}` : videoTimer}
                    </div>
                  )}

                  {/* Floating Action Controls */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                    {captureMode === 'photo' ? (
                      <button
                        type="button"
                        onClick={takePhotoSnapshot}
                        className="w-14 h-14 rounded-full bg-white text-cyan-900 shadow-xl border-4 border-slate-300 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                        title={lang === 'am' ? 'ፎቶ አንሳ' : 'Snap Photo'}
                      >
                        <Camera className="w-6 h-6 text-cyan-900" />
                      </button>
                    ) : (
                      <div>
                        {!isRecordingVideo ? (
                          <button
                            type="button"
                            onClick={startVideoRecording}
                            className="px-5 py-2.5 rounded-full bg-red-600 text-white shadow-xl hover:bg-red-700 active:scale-95 transition flex items-center gap-2 text-xs font-semibold"
                          >
                            <Video className="w-4 h-4" />
                            {lang === 'am' ? 'ቪዲዮ መቅረጽ ጀምር' : 'Start Video Recording'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVideoRecording}
                            className="px-5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-black active:scale-95 transition flex items-center gap-2 text-xs font-semibold border border-red-500"
                          >
                            <Square className="w-4 h-4 text-red-400 fill-current" />
                            {lang === 'am' ? 'ቅጂውን አቁም' : 'Stop Recording'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo File Input */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 hover:border-cyan-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {lang === 'am' ? 'የብልሽት ፎቶ ይጫኑ' : 'Upload Incident Photo'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">
                    JPEG, PNG, WEBP (Max 15MB)
                  </p>
                  <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
                    <span>{lang === 'am' ? 'ፎቶ ምረጥ' : 'Choose Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Video File Input */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 hover:border-cyan-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                    <Video className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {lang === 'am' ? 'የብልሽት ቪዲዮ ይጫኑ' : 'Upload Incident Video'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">
                    MP4, WebM, MOV (Max 50MB)
                  </p>
                  <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
                    <span>{lang === 'am' ? 'ቪዲዮ ምረጥ' : 'Choose Video'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={useSampleMedia}
                  className="text-xs text-cyan-700 hover:text-cyan-800 font-medium underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {lang === 'am' ? 'ፈጣን የሙከራ ቪዲዮ እና ፎቶ ናሙናዎችን ተጠቀም' : 'Load realistic pipeline leak footage for testing'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO VOICE NOTE */}
          {activeTab === 'audio' && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <Mic className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {lang === 'am' ? 'የድምፅ ገለፃ (Voice Memo)' : 'Audio Voice Explanation'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {lang === 'am'
                    ? 'ስለ ችግሩ ወይም ስለ ቧንቧው መሰበር በድምፅዎ ተናግረው በአጭሩ ያስረዱ'
                    : 'Speak to provide a quick verbal description of the water problem'}
                </p>
              </div>

              {isRecordingAudio ? (
                <div className="space-y-3">
                  <div className="text-red-600 font-mono text-sm font-bold flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                    REC 00:{audioTimer < 10 ? `0${audioTimer}` : audioTimer}
                  </div>
                  <button
                    onClick={stopAudioRecording}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition flex items-center gap-2 mx-auto"
                  >
                    <Square className="w-4 h-4 fill-current text-red-400" />
                    {lang === 'am' ? 'ቅጂውን አቁም' : 'Stop Voice Recording'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startAudioRecording}
                  className="px-6 py-2.5 bg-cyan-700 text-white rounded-xl text-xs font-semibold hover:bg-cyan-800 transition flex items-center gap-2 mx-auto shadow-sm"
                >
                  <Mic className="w-4 h-4" />
                  {lang === 'am' ? 'ድምፅ መቅረጽ ጀምር' : 'Start Recording Voice'}
                </button>
              )}

              {audioPreview && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">
                    {lang === 'am' ? 'የተቀረጸውን ድምፅ ያዳምጡ:' : 'Playback recorded voice memo:'}
                  </p>
                  <audio controls src={audioPreview} className="mx-auto w-full max-w-sm" />
                </div>
              )}
            </div>
          )}

          {/* Captured Media Previews Section */}
          {(photoPreview || videoPreview || audioPreview) && (
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'am' ? 'የተዘጋጁ ማስረጃዎች (Ready to Attach):' : 'Captured Evidence Attachments:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Photo Card */}
                {photoPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    <img
                      src={photoPreview}
                      alt="Captured Leak"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                      {lang === 'am' ? 'ፎቶ' : 'Photo'}
                    </div>
                    <button
                      onClick={() => setPhotoPreview(undefined)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Video Card */}
                {videoPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                      {lang === 'am' ? 'ቪዲዮ' : 'Video Clip'}
                    </div>
                    <button
                      onClick={() => setVideoPreview(undefined)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
          >
            {lang === 'am' ? 'ሰርዝ' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleConfirmAndSave}
            disabled={!photoPreview && !videoPreview && !audioPreview}
            className="px-6 py-2 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          >
            <Check className="w-4 h-4" />
            {lang === 'am' ? 'ማስረጃውን አያይዝ' : 'Attach Media Evidence'}
          </button>
        </div>
      </div>
    </div>
  );
};
