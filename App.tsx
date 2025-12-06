import React, { useState, useRef, useEffect } from 'react';
import { Camera } from './components/Camera';
import { Button } from './components/Button';
import { ERAS, EDIT_SUGGESTIONS } from './constants';
import { AppMode, Era, ProcessingState, AnalysisResult } from './types';
import { timeTravelToEra, editImageWithPrompt, analyzeImageContent } from './services/geminiService';
import { 
  History, 
  Wand2, 
  Search, 
  Camera as CameraIcon, 
  ArrowLeft, 
  Download,
  Clock,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.CAPTURE);
  const [processing, setProcessing] = useState<ProcessingState>({ isLoading: false, statusMessage: '' });
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // When an image is captured/uploaded
  const handleCapture = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setMode(AppMode.TIME_TRAVEL); // Default next step
  };

  const resetApp = () => {
    setCurrentImage(null);
    setGeneratedImage(null);
    setAnalysisResult(null);
    setMode(AppMode.CAPTURE);
    setEditPrompt('');
    setSelectedEra(null);
  };

  const handleTimeTravel = async (era: Era) => {
    if (!currentImage) return;
    
    setProcessing({ isLoading: true, statusMessage: `Traveling to ${era.name}...` });
    setSelectedEra(era);
    setGeneratedImage(null); // Clear previous result

    try {
      const result = await timeTravelToEra(currentImage, era.promptModifier);
      setGeneratedImage(result);
    } catch (err) {
      setProcessing({ isLoading: false, statusMessage: '', error: 'Time travel failed. The continuum is unstable.' });
    } finally {
      setProcessing({ isLoading: false, statusMessage: '' });
    }
  };

  const handleEdit = async () => {
    if (!currentImage && !generatedImage) return;
    if (!editPrompt.trim()) return;

    // We can edit the generated image if it exists, otherwise the original
    const sourceImage = generatedImage || currentImage;
    if (!sourceImage) return;

    setProcessing({ isLoading: true, statusMessage: 'Refining reality...' });

    try {
      const result = await editImageWithPrompt(sourceImage, editPrompt);
      setGeneratedImage(result); // Update the main view with the edited version
    } catch (err) {
      setProcessing({ isLoading: false, statusMessage: '', error: 'Edit failed. Try a different prompt.' });
    } finally {
      setProcessing({ isLoading: false, statusMessage: '' });
    }
  };

  const handleAnalyze = async () => {
    const sourceImage = generatedImage || currentImage;
    if (!sourceImage) return;

    setProcessing({ isLoading: true, statusMessage: 'Analyzing temporal data...' });
    setAnalysisResult(null);

    try {
      const text = await analyzeImageContent(sourceImage);
      setAnalysisResult({ text });
    } catch (err) {
        setProcessing({ isLoading: false, statusMessage: '', error: 'Analysis failed.' });
    } finally {
        setProcessing({ isLoading: false, statusMessage: '' });
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `chronolens-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Render Logic
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <Clock className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              ChronoLens
            </span>
          </div>
          {currentImage && (
             <Button variant="ghost" onClick={resetApp} icon={<CameraIcon size={18} />}>New Photo</Button>
          )}
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {mode === AppMode.CAPTURE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight">
              Step Into <span className="text-indigo-400">History</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 text-center max-w-xl">
              Take a selfie or upload a photo to transport yourself to any era, edit with AI, or analyze historical details.
            </p>
            <Camera onCapture={handleCapture} />
          </div>
        )}

        {mode !== AppMode.CAPTURE && currentImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* Left Sidebar / Controls */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Mode Switcher */}
              <div className="bg-gray-800 rounded-xl p-1 flex gap-1">
                <button 
                    onClick={() => setMode(AppMode.TIME_TRAVEL)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === AppMode.TIME_TRAVEL ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}
                >
                    Time Travel
                </button>
                <button 
                    onClick={() => setMode(AppMode.EDITOR)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === AppMode.EDITOR ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}
                >
                    Editor
                </button>
                <button 
                    onClick={() => setMode(AppMode.ANALYZER)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === AppMode.ANALYZER ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}
                >
                    Analyze
                </button>
              </div>

              {/* CONTROLS BASED ON MODE */}
              
              {mode === AppMode.TIME_TRAVEL && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-400"/> Select Era
                    </h2>
                    <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {ERAS.map(era => (
                            <div 
                                key={era.id}
                                onClick={() => handleTimeTravel(era)}
                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${selectedEra?.id === era.id ? 'border-indigo-500 shadow-indigo-500/20 shadow-lg' : 'border-gray-700 hover:border-gray-500'}`}
                            >
                                <div className="h-24 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
                                    <img src={era.imageSrc} alt={era.name} className="w-full h-full object-cover" />
                                    <span className="absolute bottom-2 left-2 z-20 font-bold text-sm text-white">{era.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {mode === AppMode.EDITOR && (
                 <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-indigo-400"/> Magic Editor
                    </h2>
                    <p className="text-sm text-gray-400">Describe how you want to change the image.</p>
                    <textarea 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-32"
                        placeholder="e.g., Add a futuristic helmet, Make it look like a sketch..."
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    <Button 
                        onClick={handleEdit} 
                        disabled={!editPrompt.trim()} 
                        className="w-full"
                        icon={<Sparkles size={18}/>}
                    >
                        Generate Edits
                    </Button>
                    
                    <div className="space-y-2 mt-4">
                        <p className="text-xs uppercase text-gray-500 font-semibold">Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                            {EDIT_SUGGESTIONS.map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setEditPrompt(suggestion)}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-full transition-colors text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
              )}

              {mode === AppMode.ANALYZER && (
                  <div className="space-y-4 animate-fade-in">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Search className="w-5 h-5 text-indigo-400"/> AI Analysis
                      </h2>
                      <p className="text-sm text-gray-400">Identify historical accuracy, clothing style, and more.</p>
                      
                      <Button onClick={handleAnalyze} className="w-full" icon={<Search size={18} />}>
                          Analyze Image
                      </Button>

                      {analysisResult && (
                          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4 max-h-[50vh] overflow-y-auto">
                              <h3 className="text-indigo-400 font-semibold mb-2">Analysis Report</h3>
                              <div className="prose prose-invert prose-sm">
                                  <p className="whitespace-pre-wrap text-gray-300">{analysisResult.text}</p>
                              </div>
                          </div>
                      )}
                  </div>
              )}

            </div>

            {/* Right Side / Main View */}
            <div className="lg:col-span-8 flex flex-col gap-4">
                
                {processing.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <p>{processing.error}</p>
                    </div>
                )}

                <div className="relative w-full bg-gray-800 rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center border border-gray-700">
                    
                    {processing.isLoading && (
                        <div className="absolute inset-0 z-30 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                            <p className="text-xl font-light text-indigo-300 animate-pulse">{processing.statusMessage}</p>
                        </div>
                    )}

                    {generatedImage ? (
                        <img 
                            src={generatedImage} 
                            alt="Generated Time Travel" 
                            className="w-full h-full object-contain max-h-[70vh]"
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img 
                                src={currentImage} 
                                alt="Original" 
                                className="w-full h-full object-contain max-h-[70vh] opacity-50 blur-sm scale-95 transition-all duration-700" 
                            />
                             <div className="absolute z-10 bg-black/50 px-6 py-3 rounded-full backdrop-blur-md">
                                <p className="text-white font-medium">Original Image Selected</p>
                            </div>
                        </div>
                    )}

                    {generatedImage && (
                        <div className="absolute bottom-6 right-6 flex gap-3 z-20">
                            <Button 
                                onClick={() => setGeneratedImage(null)} 
                                variant="secondary" 
                                icon={<ArrowLeft size={16}/>}
                            >
                                Revert
                            </Button>
                            <Button 
                                onClick={downloadImage} 
                                icon={<Download size={16}/>}
                            >
                                Download
                            </Button>
                        </div>
                    )}
                </div>
                
                {/* Comparison Thumbnails if generated exists */}
                {generatedImage && (
                     <div className="flex gap-4 overflow-x-auto pb-2">
                        <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-600 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setGeneratedImage(null)}>
                            <img src={currentImage} className="w-full h-full object-cover" alt="Original Thumbnail" />
                            <div className="text-xs text-center bg-black/50 absolute bottom-0 w-full text-white">Original</div>
                        </div>
                         <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-500 relative">
                            <img src={generatedImage} className="w-full h-full object-cover" alt="Result Thumbnail" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                        </div>
                     </div>
                )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default App;