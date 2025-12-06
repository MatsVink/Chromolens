import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { Camera as CameraIcon, Upload, RefreshCw } from 'lucide-react';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please allow permissions or use upload.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onCapture(imageSrc);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        {!isStreaming && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <p>Initializing Camera...</p>
                </div>
            </div>
        )}
        {error && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
             <p className="mb-4">{error}</p>
             <Button onClick={() => startCamera()} variant="secondary" icon={<RefreshCw size={16} />}>Retry</Button>
           </div>
        )}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4 mt-6">
        <Button 
          onClick={takePhoto} 
          disabled={!isStreaming}
          className="w-40 h-12 text-lg"
          icon={<CameraIcon size={20} />}
        >
          Snap Photo
        </Button>
        
        <div className="relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="secondary" className="w-40 h-12 text-lg" icon={<Upload size={20} />}>
                Upload
            </Button>
        </div>
      </div>
    </div>
  );
};