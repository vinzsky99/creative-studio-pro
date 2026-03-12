/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Download, Zap, Image as ImageIcon,
  X, Wand2, Loader2, ChevronDown, Layers, Grid,
  FileText, Copy, Check, ScanEye, Palette, Video, 
  Globe, AlertCircle, Sparkles, Trash2, Code, ExternalLink,
  Lightbulb,
  FileSpreadsheet, Maximize2, ShieldAlert, Activity,
  Scale, Fingerprint, Search, Info, TrendingUp,
  Target, Filter, Cpu, FileImage,
  Building2, PenTool, CheckCircle2, AlertTriangle, XCircle, FileType, Clock, Plus, Archive,
  Sun, Moon, Flame, RefreshCw, SlidersHorizontal
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { 
  ART_STYLES, CAMERA_ANGLES, LIGHTING_STYLES, LOOP_STYLES, MOTION_STYLES, 
  RESOLUTIONS, RESEARCH_FILTERS, MEDIA_TYPES, AGENCY_FORMATS, 
  GEN_FORMATS, META_FORMATS, DICT 
} from './constants';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// --- HELPER COMPONENTS ---

const SmartDropdown = ({ title, icon: Icon, list, selectedMulti, setSelectedMulti, selectedSingle, setSelectedSingle, isMultiMode, setIsMultiMode, customValue, setCustomValue, lang, forceSingle = false }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = DICT[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (item: string) => {
    if (isMultiMode && !forceSingle) {
       if(item === t?.none) { setSelectedMulti([]); } 
       else if(item === t?.custom) {
           const current = Array.isArray(selectedMulti) ? selectedMulti : [];
           if(current.includes(t?.custom)) setSelectedMulti(current.filter((i: string) => i !== t?.custom));
           else setSelectedMulti([...current, t?.custom]);
       } else {
           const current = Array.isArray(selectedMulti) ? selectedMulti : [];
           if(current.includes(t?.custom)) return;
           if (current.includes(item)) setSelectedMulti(current.filter((i: string) => i !== item));
           else setSelectedMulti([...current, item]);
       }
    } else {
       setSelectedSingle(item); 
       if(item !== t?.custom) setIsOpen(false);
    }
  };

  const fullList = [t?.none, t?.custom, ...(Array.isArray(list) ? list : [])].filter(Boolean);
  const filteredList = fullList.filter(item => 
    typeof item === 'string' && 
    item.toLowerCase().includes((search || '').toLowerCase())
  );
  const showCustomInput = (isMultiMode && !forceSingle) ? (Array.isArray(selectedMulti) && selectedMulti.includes(t?.custom)) : selectedSingle === t?.custom;

  return (
    <div className="relative mb-4 w-full" ref={dropdownRef}>
      <label className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5"><Icon className="w-4 h-4 text-indigo-500"/> {title}</div>
        {!forceSingle && setIsMultiMode && (
           <button onClick={() => setIsMultiMode(!isMultiMode)} className={`text-[10px] px-2 py-1 rounded border transition-colors ${isMultiMode ? 'bg-indigo-900 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>{isMultiMode ? 'MULTI' : 'SINGLE'}</button>
        )}
      </label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-slate-900/40 border border-slate-700 hover:border-indigo-500/50 rounded-xl px-4 py-3 flex items-center justify-between text-sm transition-all shadow-sm">
        <span className="truncate text-gray-400">{(isMultiMode && !forceSingle) ? (Array.isArray(selectedMulti) && selectedMulti.length > 0 ? `${selectedMulti.length} ${t?.selected}` : t?.none) : selectedSingle || t?.none}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {showCustomInput && (
          <div className="mt-2 animate-in slide-in-from-top-1"><textarea value={customValue} onChange={(e) => setCustomValue(e.target.value)} placeholder={`${t?.type || 'Type'} ${(title || '').toString().toLowerCase()} custom...`} className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 h-20 resize-none placeholder:text-gray-500"/></div>
      )}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col">
           <div className="p-2 border-b border-slate-800"><input type="text" placeholder={t?.search || 'Search...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-950 text-sm p-2.5 rounded-lg border border-slate-800 focus:border-indigo-500 outline-none"/></div>
           <div className="overflow-y-auto custom-scrollbar p-1 flex-1">
             {filteredList.map((item, idx) => (
               <button key={idx} onClick={() => toggleSelection(item)} className={`w-full text-left px-4 py-2.5 text-xs rounded-lg mb-0.5 flex items-center justify-between transition-colors ${((isMultiMode && !forceSingle) ? selectedMulti.includes(item) : selectedSingle === item) ? 'bg-indigo-500/20 text-indigo-500 font-bold' : 'text-gray-400 hover:bg-slate-800'}`}>
                 {item} {((isMultiMode && !forceSingle) ? selectedMulti.includes(item) : selectedSingle === item) && <Check className="w-4 h-4 text-indigo-500" />}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

const ScoreMeter = ({ value, label, colorClass = "text-indigo-500" }: any) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-sm">
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * value) / 100} className={`${colorClass} transition-all duration-1000`} />
      </svg>
      <span className="absolute text-sm font-bold">{value}%</span>
    </div>
    <span className="text-xs font-bold text-gray-500 uppercase text-center">{label}</span>
  </div>
);

const UploadMini = ({ icon: Icon, label, previewUrl, onUpload, onClear, accept, type = 'image', fileName }: any) => (
    <div className="h-40 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 relative hover:bg-slate-900/50 transition-colors overflow-hidden group flex items-center justify-center shrink-0">
        {previewUrl ? ( 
            type === 'video' ? <video src={previewUrl} className="w-full h-full object-contain bg-black" controls /> : 
            type === 'document' ? <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 text-emerald-500"><FileText className="w-10 h-10 mb-2"/><span className="text-xs font-bold text-gray-400 max-w-[80%] truncate px-2 text-center">{fileName}</span></div> :
            <img src={previewUrl} className="w-full h-full object-cover opacity-80" alt="Preview" /> 
        ) : (
           <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-indigo-500 transition-colors w-full h-full">
              <Icon className="w-8 h-8 mb-3 opacity-50"/> <span className="text-xs font-bold text-center px-4">{label}</span>
              <input type="file" className="hidden" accept={accept} onChange={onUpload}/>
           </label>
        )}
        {previewUrl && <button onClick={onClear} className="absolute top-3 right-3 bg-red-600/90 text-white p-1.5 rounded shadow-lg hover:bg-red-500 z-10"><X className="w-4 h-4"/></button>}
    </div>
);

const CopyButton = ({ text, tooltipText, targetId }: any) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => { 
      if(!text) return; 
      navigator.clipboard.writeText(text); 
      
      if(targetId) {
          const el = document.getElementById(targetId) as HTMLTextAreaElement | HTMLInputElement;
          if(el) {
              el.focus();
              el.select();
          }
      }
      
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
  };
  
  return ( 
    <button onClick={handleCopy} className="flex items-center gap-1.5 p-1.5 px-3 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-current border border-transparent hover:border-slate-600 bg-slate-800/80 shadow-sm">
        {copied ? <Check className="w-4 h-4 text-emerald-500"/> : <Copy className="w-4 h-4"/>}
        {tooltipText && <span className="text-[10px] font-bold uppercase">{copied ? 'Copied!' : tooltipText}</span>}
    </button> 
  );
};

export default function App() {
  const [lang, setLang] = useState('EN'); 
  const [theme, setTheme] = useState('dark'); 
  const [bgOpacity, setBgOpacity] = useState(100);
  const [showOpacity, setShowOpacity] = useState(false);
  const [activeTab, setActiveTab] = useState('t2i');
  const [viewMode, setViewMode] = useState('desktop');
  const [contentType, setContentType] = useState('Image');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const opacityRef = useRef<HTMLDivElement>(null);
  const t = DICT[lang];

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
       if (opacityRef.current && !opacityRef.current.contains(e.target as Node)) setShowOpacity(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to generate high-quality video thumbnail
  const generateVideoThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;
      
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve('');
      }, 5000);

      video.onloadeddata = () => {
        // Seek to 1 second or middle of video to avoid black start frame
        video.currentTime = Math.min(1, video.duration / 2);
      };
      
      video.onseeked = () => {
        clearTimeout(timeout);
        const canvas = document.createElement('canvas');
        // High quality thumbnail resolution
        const width = 1280;
        const height = 720;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx && video.videoWidth > 0) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          
          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = width / height;
          let drawWidth = width;
          let drawHeight = height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (videoRatio > canvasRatio) {
            drawHeight = width / videoRatio;
            offsetY = (height - drawHeight) / 2;
          } else {
            drawWidth = height * videoRatio;
            offsetX = (width - drawWidth) / 2;
          }
          
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        }
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };
      
      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  };

  // Robust API Call with Exponential Backoff using SDK
  const callGeminiSDK = async (model: string, contents: any, config: any = {}, retries = 4) => {
    let delay = 500; 
    let lastError;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config
        });
        return response;
      } catch (err) {
        lastError = err;
        if (i === retries - 1) break;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; 
      }
    }
    throw lastError;
  };

  // Helper to extract clean JSON from markdown blocks
  const extractCleanJSON = (text: string) => {
      try {
        let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON Parse Error", e);
        return {};
      }
  };

  // ==========================================
  // MODULE 1: AI GENERATOR (T2I & I2I)
  // ==========================================
  const [prompt, setPrompt] = useState('');
  const [resolutionKey, setResolutionKey] = useState('3:2');
  const [batchCount, setBatchCount] = useState<number | string>(1);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [genMode, setGenMode] = useState('t2i');
  const [refImage, setRefImage] = useState<string | null>(null);
  const [genTargetExt, setGenTargetExt] = useState('.png');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const [styleModeMulti, setStyleModeMulti] = useState(false);
  const [angleModeMulti, setAngleModeMulti] = useState(false);
  const [selStyleSingle, setSelStyleSingle] = useState("None");
  const [selStylesMulti, setSelStylesMulti] = useState<string[]>([]);
  const [selAngleSingle, setSelAngleSingle] = useState("None");
  const [selAnglesMulti, setSelAnglesMulti] = useState<string[]>([]);
  const [customStyleText, setCustomStyleText] = useState('');
  const [customAngleText, setCustomAngleText] = useState('');
  
  const [selLoopSingle, setSelLoopSingle] = useState("None");
  const [customLoopText, setCustomLoopText] = useState('');

  const [activeModal, setActiveModal] = useState({ show: false, mode: '', index: -1, url: '' });
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [isRevising, setIsRevising] = useState(false);

  useEffect(() => {
      if(selStyleSingle === DICT['ID'].none || selStyleSingle === DICT['EN'].none) setSelStyleSingle(t.none);
      if(selAngleSingle === DICT['ID'].none || selAngleSingle === DICT['EN'].none) setSelAngleSingle(t.none);
      if(selLoopSingle === DICT['ID'].none || selLoopSingle === DICT['EN'].none) setSelLoopSingle(t.none);
  }, [lang, t.none]);

  const analyzeImageForPrompt = async (base64Img: string) => {
      if (!base64Img) return;
      setIsAnalyzingImage(true);
      try {
          const contents = [{ parts: [
              { text: "Analyze this image in detail and create a highly descriptive text prompt (in English) that captures all visual elements, composition, lighting, style, subject matter, and mood. Keep it under 100 words." },
              { inlineData: { mimeType: 'image/jpeg', data: base64Img.split(',')[1] } }
          ]}];
          const response = await callGeminiSDK("gemini-3-flash-preview", contents);
          const description = response.text;
          if (description) {
              setPrompt(description.trim());
          }
      } catch (e) {
          console.error("Failed to auto-analyze image", e);
      } finally {
          setIsAnalyzingImage(false);
      }
  };

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const r = new FileReader(); 
      r.onload = (ev) => {
          const result = ev.target?.result as string;
          setRefImage(result);
          if (genMode === 'i2i') {
              analyzeImageForPrompt(result);
          }
      }; 
      r.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt) { setError(t.errDescReq); return; }
    if (genMode === 'i2i' && !refImage) { setError(t.errImgReq); return; }
    setIsProcessing(true); setError(''); 

    let finalStyle = styleModeMulti ? selStylesMulti.map(s => s === t.custom ? customStyleText : s).filter(s => s !== t.none && s.trim() !== "").join(", ") : (selStyleSingle === t.custom ? customStyleText : (selStyleSingle === t.none ? "" : selStyleSingle));
    let finalAngle = angleModeMulti ? selAnglesMulti.map(a => a === t.custom ? customAngleText : a).filter(a => a !== t.none && a.trim() !== "").join(", ") : (selAngleSingle === t.custom ? customAngleText : (selAngleSingle === t.none ? "" : selAngleSingle));
    let finalLoop = selLoopSingle === t.custom ? customLoopText : (selLoopSingle === t.none ? "" : selLoopSingle);

    let loopDirective = finalLoop ? ` Ensure the image characteristics support a ${finalLoop}.` : "";

    const baseDetails = "8k resolution, highest quality, photorealistic masterpiece. EXTREMELY STRICT CRITICAL RULE: ABSOLUTELY NO TEXT, NO WATERMARKS, NO LOGOS, NO SIGNATURES, NO WORDS, NO LETTERS, NO BRANDS. Ensure a perfectly clean image without any typographic or structural elements that look like writing.";
    const fullPrompt = `[STRICT: NO TEXT/WATERMARK]. ${prompt}. \n${finalStyle ? `Style: ${finalStyle}.` : ''} \n${finalAngle ? `Angle: ${finalAngle}.` : ''} ${loopDirective}\n${baseDetails}`;
    
    const count = Math.min(Math.max(1, Number(batchCount) || 1), 4);
    const apiRatio = RESOLUTIONS[resolutionKey as keyof typeof RESOLUTIONS].apiRatio; 

    // Check for API key if generating video
    if (contentType === 'Video' && !hasApiKey) {
      await handleOpenKeyDialog();
    }

    try {
      const titleKey = lang === 'ID' ? "judul/deskripsi" : "title/description";
      
      const generationPromises = Array.from({ length: count }).map(async (_, i) => {
          if (i > 0) await new Promise(r => setTimeout(r, i * 400)); 
          
          let resultUrl;
          let isVideo = false;
          const currentPrompt = count > 1 ? `${fullPrompt} (Ensure uniqueness for Variation ${i+1}).` : fullPrompt;

          if (contentType === 'Video') {
            isVideo = true;
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            let operation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: currentPrompt,
              config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: apiRatio === '16:9' ? '16:9' : '9:16'
              }
            });

            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
              const response = await fetch(downloadLink, {
                method: 'GET',
                headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY as string },
              });
              const blob = await response.blob();
              resultUrl = URL.createObjectURL(blob);
            }
          } else {
            if(genMode === 't2i') {
              const contents = { parts: [{ text: currentPrompt }] };
              const config = { imageConfig: { aspectRatio: apiRatio, imageSize: "1K" } };
              const response = await callGeminiSDK("gemini-3.1-flash-image-preview", contents, config);
              const imgPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
              if(imgPart) resultUrl = `data:image/png;base64,${imgPart.inlineData.data}`;
            } else {
              const contents = { parts: [{ text: currentPrompt }, { inlineData: { mimeType: 'image/jpeg', data: refImage!.split(',')[1] } }] };
              const config = { imageConfig: { aspectRatio: apiRatio, imageSize: "1K" } };
              const response = await callGeminiSDK("gemini-3.1-flash-image-preview", contents, config);
              const imgPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
              if(imgPart) resultUrl = `data:image/png;base64,${imgPart.inlineData.data}`;
            }
          }
          
          if(resultUrl) { 
              const randMotionStr = MOTION_STYLES[(i + Math.floor(Math.random() * 10)) % MOTION_STYLES.length];
              const randLighting = LIGHTING_STYLES[Math.floor(Math.random() * LIGHTING_STYLES.length)];

              const videoJsonData = {
                  "title": `${(prompt || '').substring(0, 80)}...`,
                  "description": `High-quality ${(contentType || 'Image').toLowerCase()} featuring ${(prompt || '').substring(0, 150)}. Perfect for commercial stock use.`,
                  "scene": `A cinematic ${(contentType || 'Image').toLowerCase()} scene with ${(randLighting || 'Natural').toLowerCase()} and ${(randMotionStr || 'Smooth').toLowerCase()} movement, captured at ${finalAngle || "Auto"} angle.`,
                  "duration": isVideo ? "5 seconds" : "8 seconds",
                  "loop": finalLoop || "none",
                  "motion": randMotionStr,
                  "angle": finalAngle || "Auto",
                  "lighting": randLighting,
                  "negative_prompt": "Blurry, text, watermark, logo, word, letter, signature, compression artifacts, noise, flicker, overexposed, ai artifacts, poor composition.",
                  "settings": { "ratio": resolutionKey }
              };
              return { url: resultUrl, videoJson: JSON.stringify(videoJsonData, null, 2), resKey: resolutionKey, targetExt: isVideo ? '.mp4' : genTargetExt, type: isVideo ? 'video' : 'image' }; 
          }
          return null;
      });

      const results = await Promise.allSettled(generationPromises);
      const newImgs = results.filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && !!r.value).map(r => r.value);
      
      if (newImgs.length > 0) {
          setGeneratedImages(prev => [...prev, ...newImgs]);
      } else {
          throw new Error("Gagal menghasilkan gambar. API mungkin sedang sibuk, silakan coba lagi.");
      }
    } catch(e: any) { 
        setError(e.message || "Generate failed."); 
    } finally { 
        setIsProcessing(false); 
    }
  };

  const handleRevision = async () => {
    if (!revisionPrompt) return;
    setIsRevising(true); setError('');
    try {
        const base64Data = activeModal.url.split(',')[1]; 
        const finalRevisePrompt = `Strictly modify the image based on this instruction: ${revisionPrompt}. EXTREMELY STRICT: ABSOLUTELY NO text, NO watermarks, NO signatures, NO logos are added or left behind. Remove any existing text.`;
        
        const contents = { parts: [{ text: finalRevisePrompt }, { inlineData: { mimeType: 'image/png', data: base64Data } }] };
        const response = await callGeminiSDK("gemini-2.5-flash-image", contents);
        const imgPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if(imgPart) {
            const newUrl = `data:image/png;base64,${imgPart.inlineData.data}`;
            setGeneratedImages(prev => {
                const updated = [...prev]; updated[activeModal.index].url = newUrl; return updated;
            });
            setActiveModal({ show: false, mode: '', index: -1, url: '' });
            setRevisionPrompt('');
        } else { throw new Error("Failed to revise image."); }
    } catch(e: any) { setError("Revision failed: " + e.message); } finally { setIsRevising(false); }
  };

  const handleAutoInspiration = async () => {
    setIsProcessing(true); setError('');
    try {
        const researchContext = researchResult ? 
          `Based on this market research: ${JSON.stringify(researchResult)}. ` : 
          "Based on global trending stock content and viral visual themes. ";
        
        let sysPrompt = `Act as a Creative Director for a stock agency. 
        Generate a high-quality, descriptive text prompt for a ${contentType} that would sell well on Adobe Stock.
        ${researchContext}
        Focus on high commercial value, clean composition, and current aesthetic trends.
        Output ONLY the prompt text, no other commentary.`;

        let contents: any = { parts: [{ text: `Generate a trending ${contentType} prompt.` }] };

        if (genMode === 'i2i' && refImage) {
            sysPrompt = `Act as a Creative Director. Based on the provided reference image, generate a high-quality, descriptive text prompt for a ${contentType} that enhances or modifies the scene for commercial stock photography.
            ${researchContext}
            Focus on high commercial value, clean composition, and current aesthetic trends.
            Output ONLY the prompt text, no other commentary.`;
            contents = { parts: [
                { text: `Generate a trending ${contentType} prompt based on this image.` },
                { inlineData: { mimeType: 'image/jpeg', data: refImage.split(',')[1] } }
            ]};
        }

        const config = { systemInstruction: sysPrompt };
        const response = await callGeminiSDK("gemini-3-flash-preview", contents, config);
        const generatedPrompt = response.text?.trim();
        if (generatedPrompt) {
            setPrompt(generatedPrompt);
        } else {
            throw new Error("Model returned empty prompt.");
        }
    } catch (e: any) {
        setError("Auto inspiration failed: " + e.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const clearImages = () => setGeneratedImages([]);

  const handleDownloadFormat = (url: string, index: number, resKey: string, format: string) => {
      const targetRes = RESOLUTIONS[resKey as keyof typeof RESOLUTIONS];
      if (!targetRes) return;
      
      const filenameBase = `CreativeStudio_8K_${resKey.replace(':', 'x')}_${index}`;
      const link = document.createElement('a');

      if (format === 'MP4') {
          link.href = url;
          link.download = `${filenameBase}.mp4`;
          link.click();
          return;
      }

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
          const canvas = document.createElement('canvas'); canvas.width = targetRes.w; canvas.height = targetRes.h;
          const ctx = canvas.getContext('2d');
          if(!ctx) return;
          const imgRatio = img.width / img.height; const targetRatio = targetRes.w / targetRes.h;
          let drawW = targetRes.w; let drawH = targetRes.h; let offsetX = 0; let offsetY = 0;
          
          if (imgRatio > targetRatio) { drawW = targetRes.h * imgRatio; offsetX = (targetRes.w - drawW) / 2; } 
          else { drawH = targetRes.w / imgRatio; offsetY = (targetRes.h - drawH) / 2; }
          
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          
          const filenameBase = `CreativeStudio_8K_${resKey.replace(':', 'x')}_${index}`;
          const link = document.createElement('a');

          if (format === 'PNG') { link.href = canvas.toDataURL('image/png', 1.0); link.download = `${filenameBase}.png`; } 
          else if (format === 'JPG' || format === 'JPEG') { link.href = canvas.toDataURL('image/jpeg', 1.0); link.download = `${filenameBase}.${format.toLowerCase()}`; } 
          else if (format === 'SVG') {
              const base64Img = canvas.toDataURL('image/jpeg', 0.9);
              const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${targetRes.w}" height="${targetRes.h}"><image href="${base64Img}" width="100%" height="100%"/></svg>`;
              const blob = new Blob([svgContent], {type: 'image/svg+xml'}); link.href = URL.createObjectURL(blob); link.download = `${filenameBase}.svg`;
          } else if (format === 'EPS') {
              const epsContent = `%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${targetRes.w} ${targetRes.h}\n%%Creator: Creative Studio V1.30\n%%EndComments\n% Raster Image Wrapper\n/DeviceRGB setcolorspace\n<<\n  /ImageType 1\n  /Width ${targetRes.w}\n  /Height ${targetRes.h}\n  /BitsPerComponent 8\n  /Decode [0 1 0 1 0 1]\n  /ImageMatrix [${targetRes.w} 0 0 -${targetRes.h} 0 ${targetRes.h}]\n  /DataSource (Image data embedded as SVG fallback for browsers)\n>> image\n%%EOF`;
              const blob = new Blob([epsContent], {type: 'application/postscript'}); link.href = URL.createObjectURL(blob); link.download = `${filenameBase}.eps`;
          } else if (format === 'AI') {
              const aiContent = `%PDF-1.5\n%Mock AI File generated by Creative Studio V1.30\n%%EOF`;
              const blob = new Blob([aiContent], {type: 'application/illustrator'}); link.href = URL.createObjectURL(blob); link.download = `${filenameBase}.ai`;
          } else if (format === 'PSD') {
              const psdContent = `8BPS\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`; 
              const blob = new Blob([psdContent], {type: 'image/vnd.adobe.photoshop'}); link.href = URL.createObjectURL(blob); link.download = `${filenameBase}.psd`;
          }
          link.click();
      };
      img.src = url;
  };

  // ==========================================
  // MODULE 2: STOCK ANALYSIS (Metadata & Queue)
  // ==========================================
  const [metaQueue, setMetaQueue] = useState<any[]>([]);
  const [activeMetaId, setActiveMetaId] = useState<string | null>(null);
  const [isExtractingQueue, setIsExtractingQueue] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('Adobe Stock');
  const [metaTargetExt, setMetaTargetExt] = useState('.jpg');
  const [metaInstructions, setMetaInstructions] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaCategory, setMetaCategory] = useState('');

  const handleAddMetaFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if(!files.length) return;

      const newItems = await Promise.all(files.map(async (f: File) => {
          const ext = f.name.split('.').pop()?.toLowerCase();
          let type = 'image'; let preview = null;

          if (f.type.includes('video') || (ext && ['mp4','mov'].includes(ext))) { 
              type = 'video'; 
              preview = await generateVideoThumbnail(f); 
              const videoSrc = URL.createObjectURL(f);
              return { id: Math.random().toString(36).substr(2, 9), file: f, name: f.name, type: type, preview: preview, videoSrc: videoSrc, status: 'pending', result: null };
          } 
          else if (f.type.includes('svg') || ext === 'svg') { type = 'image'; preview = `data:image/svg+xml;base64,${btoa(await f.text())}`; } 
          else if (ext && ['eps', 'ai', 'psd'].includes(ext)) { type = 'document'; preview = 'document'; } 
          else { type = 'image'; preview = URL.createObjectURL(f); }

          return { id: Math.random().toString(36).substr(2, 9), file: f, name: f.name, type: type, preview: preview, status: 'pending', result: null };
      }));

      setMetaQueue(prev => {
          const updated = [...prev, ...newItems];
          if (!activeMetaId && updated.length > 0) setActiveMetaId(updated[0].id);
          return updated;
      });
  };

  const runSingleMeta = async (item: any) => {
      let base64Data = ""; let isVectorMock = false;

      if (item.type === 'video') {
         const thumbDataUrl = await generateVideoThumbnail(item.file);
         base64Data = thumbDataUrl.split(',')[1] || "";
      } else if (item.type === 'image' && item.file.type.includes('svg')) { base64Data = btoa(await item.file.text()); } 
      else if (item.type === 'document') { base64Data = btoa("Simulated Document data for " + item.name); isVectorMock = true; } 
      else { base64Data = await new Promise((res) => { const r = new FileReader(); r.onloadend = () => res((r.result as string).split(',')[1]); r.readAsDataURL(item.file); }); }

      let promptText = `Analyze for Microstock Contributor. Generate highly specific and UNIQUE metadata based strictly on the exact visual contents of this media. Pay attention to unique details, colors, objects, and composition to ensure descriptions and keywords are NOT generic. Output JSON EXACTLY matching this structure:
      {
        "title": "A highly descriptive, concise title using exact visual elements (Max 4-5 words, no special chars)",
        "description_id": "Satu kalimat deskripsi komersial utuh dan spesifik (Maksimal 150 karakter, tidak boleh lebih)",
        "description_en": "One complete specific commercial description (Maximum 150 characters, strict limit)",
        "keywords": "Exactly 30 highly relevant, specific, and unique comma-separated keywords in English (ALL LOWERCASE)",
        "category": "Adobe Stock Category Name"
      }
      
      IMPORTANT INSTRUCTIONS:
      1. Title MUST be 4-5 words only.
      2. If manual instructions are provided, prioritize them: ${metaInstructions || 'None'}
      3. If specific keywords are requested, include them: ${metaKeywords || 'None'}
      4. If a category is requested, use it or find the best match from this list: ${metaCategory || 'animal, building and architecture, business, drinks, the enviroment, state of mind, food, graphic resources, hobbies, industry, lanscapes, lifestyle, people, plant and folwers, culture and religion, science, social issues, sport, technology, transport, travel'}.
      5. Ensure the category returned is one of the standard Adobe Stock categories.`;
      if (isVectorMock) promptText += `\n\nCatatan: Karena file adalah format sumber (.eps/.ai/.psd) bernama "${item.name}", buatlah deskripsi dan keyword terbaik yang sangat relevan berdasarkan nama file tersebut secara unik.`;

      const contents = [{ parts: [{ text: promptText }, { inlineData: { mimeType: item.file.type.includes('svg') || isVectorMock ? 'text/plain' : 'image/jpeg', data: base64Data } }] }];
      const config = { responseMimeType: "application/json" };
      
      const response = await callGeminiSDK("gemini-3-flash-preview", contents, config);
      const json = extractCleanJSON(response.text);
      
      let rawTitle = json.title || json.description_en || item.name.split('.')[0] || 'stock-media';
      let cleanFilename = (rawTitle || '').toString().toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().split(/\s+/).slice(0, 5).join('-');
      if (cleanFilename.endsWith('-')) cleanFilename = cleanFilename.slice(0, -1);
      if (!cleanFilename) cleanFilename = "untitled-asset";

      let rawKeywords = (json.keywords || '').toString().split(',').map((k: string) => k.trim()).filter((k: string) => k);
      let cleanKeywords = rawKeywords.slice(0, 30).join(', ').toLowerCase();

      let desc_id = (json.description_id || json.description || '').trim();
      if(desc_id.length > 150) desc_id = desc_id.substring(0, 150);
      let desc_en = (json.description_en || json.description || '').trim();
      if(desc_en.length > 150) desc_en = desc_en.substring(0, 150);

      return {
          filename: cleanFilename + metaTargetExt, originalName: item.name, keywords: cleanKeywords,
          description_id: desc_id,
          description_en: desc_en,
          category: json.category || 'Illustration'
      };
  };

  const processMetaQueue = async (currentIndex: number, currentQueue: any[]) => {
      if (currentIndex >= currentQueue.length) { setIsExtractingQueue(false); return; }
      const item = currentQueue[currentIndex];
      
      if (item.status === 'done') { processMetaQueue(currentIndex + 1, currentQueue); return; }
      if (item.status === 'error') { setIsExtractingQueue(false); return; } 

      setMetaQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q));
      setActiveMetaId(item.id);

      try {
          const result = await runSingleMeta(item);
          setMetaQueue(prev => {
              const newQ = prev.map(q => q.id === item.id ? { ...q, status: 'done', result } : q);
              setTimeout(() => processMetaQueue(currentIndex + 1, newQ), 100); 
              return newQ;
          });
      } catch (e: any) { 
          setMetaQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: e.message } : q));
          setIsExtractingQueue(false); 
      }
  };

  const handleRetryMeta = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setMetaQueue(prev => {
          const newQ = prev.map(q => q.id === id ? { ...q, status: 'pending', error: null } : q);
          const idx = newQ.findIndex(q => q.id === id);
          setIsExtractingQueue(true);
          processMetaQueue(idx, newQ);
          return newQ;
      });
  };

  const handleStartOrRetryMeta = () => {
      if (isExtractingQueue) return;
      const hasPending = metaQueue.some(q => q.status === 'pending');
      if (!hasPending && metaQueue.length > 0) {
          setMetaQueue(prev => prev.map(q => ({ ...q, status: 'pending', result: null, error: null })));
          setTimeout(() => {
              setIsExtractingQueue(true);
              setMetaQueue(latestQueue => { processMetaQueue(0, latestQueue); return latestQueue; });
          }, 50);
      } else {
          setIsExtractingQueue(true);
          setMetaQueue(latestQueue => { processMetaQueue(0, latestQueue); return latestQueue; });
      }
  };

  const clearMetaQueue = () => { if(isExtractingQueue) return; setMetaQueue([]); setActiveMetaId(null); }

  const activeMetaData = metaQueue.find(q => q.id === activeMetaId);
  const stockData = activeMetaData ? activeMetaData.result : null;
  const currentStockDesc = stockData ? (lang === 'ID' ? stockData.description_id : stockData.description_en) : '';
  const isMetaAllDoneOrError = metaQueue.length > 0 && !metaQueue.some(q => q.status === 'pending' || q.status === 'processing');

  const exportCsv = (itemsToExport: any[]) => {
      if (!itemsToExport || itemsToExport.length === 0) return;
      const format = AGENCY_FORMATS[selectedAgency as keyof typeof AGENCY_FORMATS];
      const escapeCSV = (str: any) => `"${String(str).replace(/"/g, '""')}"`;
      
      const headers = format.headers.map(escapeCSV).join(',') + '\n';
      let rows = '';

      itemsToExport.forEach(item => {
          if(!item.result) return;
          const title = lang === 'ID' ? item.result.description_id : item.result.description_en;
          const rowData = format.getRow(item.result, title);
          rows += rowData.map(escapeCSV).join(',') + '\n';
      });
      
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url;
      link.download = `${selectedAgency.replace(/\s+/g, '')}_Bulk_Metadata_${new Date().getTime()}.csv`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleExportCsvActive = () => { if (activeMetaData && activeMetaData.result) exportCsv([activeMetaData]); };
  const handleExportCsvAll = () => { const doneItems = metaQueue.filter(q => q.status === 'done'); if (doneItems.length > 0) exportCsv(doneItems); };

  const handleExportZipAll = async () => {
      const doneItems = metaQueue.filter(q => q.status === 'done');
      if (doneItems.length === 0) return;
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const format = AGENCY_FORMATS[selectedAgency as keyof typeof AGENCY_FORMATS]; const escapeCSV = (str: any) => `"${String(str).replace(/"/g, '""')}"`;
      const headers = format.headers.map(escapeCSV).join(',') + '\n'; let rows = '';
      doneItems.forEach(item => {
          const title = lang === 'ID' ? item.result.description_id : item.result.description_en;
          const rowData = format.getRow(item.result, title); rows += rowData.map(escapeCSV).join(',') + '\n';
      });
      zip.file(`Master_${selectedAgency.replace(/\s+/g, '')}_Metadata.csv`, headers + rows);

      const txtFolder = zip.folder("Metadata_Texts");
      doneItems.forEach(item => {
          const r = item.result;
          const content = `FILENAME: ${r.filename}\nORIGINAL: ${r.originalName}\nTITLE_EN: ${r.description_en}\nTITLE_ID: ${r.description_id}\n\nKEYWORDS:\n${r.keywords}`;
          txtFolder?.file(`${r.filename.split('.')[0]}.txt`, content);
      });

      const content = await zip.generateAsync({type:"blob"});
      const link = document.createElement('a'); link.href = URL.createObjectURL(content);
      link.download = `CreativeStudio_Metadata_${new Date().getTime()}.zip`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // ==========================================
  // MODULE 3: TECHNICAL AUDIT (Multi-Frame Video System)
  // ==========================================
  const [qaQueue, setQaQueue] = useState<any[]>([]);
  const [activeQaId, setActiveQaId] = useState<string | null>(null);
  const [isAuditingQueue, setIsAuditingQueue] = useState(false);

  const handleAddQaFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if(!files.length) return;

      const newItems = await Promise.all(files.map(async (f: File) => {
          const ext = f.name.split('.').pop()?.toLowerCase();
          let type = 'image'; let preview = null;

          if (f.type.includes('video') || (ext && ['mp4','mov'].includes(ext))) { 
              type = 'video'; 
              preview = await generateVideoThumbnail(f);
              const videoSrc = URL.createObjectURL(f);
              return { id: Math.random().toString(36).substr(2, 9), file: f, name: f.name, type: type, preview: preview, videoSrc: videoSrc, status: 'pending', result: null };
          } 
          else if (f.type.includes('svg') || ext === 'svg') { type = 'image'; preview = `data:image/svg+xml;base64,${btoa(await f.text())}`; } 
          else if (ext && ['eps', 'ai', 'psd'].includes(ext)) { type = 'document'; preview = 'document'; } 
          else { type = 'image'; preview = URL.createObjectURL(f); }

          return { id: Math.random().toString(36).substr(2, 9), file: f, name: f.name, type: type, preview: preview, status: 'pending', result: null };
      }));

      setQaQueue(prev => {
          const updated = [...prev, ...newItems];
          if (!activeQaId && updated.length > 0) setActiveQaId(updated[0].id);
          return updated;
      });
  };

  const compressImageForAudit = async (file: File) => {
      return new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas'); const MAX_SIZE = 1024;
              let width = img.width; let height = img.height;
              if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
              else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
              canvas.width = width; canvas.height = height; canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
          };
          img.src = URL.createObjectURL(file);
      });
  };

  const extractVideoFrames = async (file: File, count = 3) => {
      return new Promise<string[]>(async (resolve) => {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.muted = true;
          video.playsInline = true;
          const url = URL.createObjectURL(file);
          video.src = url;
          
          const timeout = setTimeout(() => {
              URL.revokeObjectURL(url);
              resolve([]);
          }, 15000);

          try {
              await new Promise((res, rej) => {
                  video.onloadeddata = res;
                  video.onerror = rej;
              });
              
              const frames = [];
              const times = [0.2, 0.5, 0.8]; 
              for (let time of times) {
                  video.currentTime = video.duration * time;
                  await new Promise((res) => {
                      const onSeeked = () => {
                          video.removeEventListener('seeked', onSeeked);
                          res(true);
                      };
                      video.addEventListener('seeked', onSeeked);
                  });
                  const canvas = document.createElement('canvas'); 
                  canvas.width = 1280; canvas.height = 720;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                      ctx.fillStyle = '#000000';
                      ctx.fillRect(0, 0, 1280, 720);
                      const videoRatio = video.videoWidth / video.videoHeight;
                      const canvasRatio = 1280 / 720;
                      let drawW = 1280; let drawH = 720;
                      let offX = 0; let offY = 0;
                      if (videoRatio > canvasRatio) { drawH = 1280 / videoRatio; offY = (720 - drawH) / 2; }
                      else { drawW = 720 * videoRatio; offX = (1280 - drawW) / 2; }
                      ctx.drawImage(video, offX, offY, drawW, drawH);
                  }
                  frames.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
              }
              clearTimeout(timeout);
              URL.revokeObjectURL(url);
              resolve(frames);
          } catch (e) {
              clearTimeout(timeout);
              URL.revokeObjectURL(url);
              resolve([]);
          }
      });
  };

  const runSingleAudit = async (item: any) => {
      let parts: any[] = []; let mimeType = item.file.type;
      const ext = item.name.split('.').pop()?.toLowerCase();

      if (item.type === 'video') {
          const frames = await extractVideoFrames(item.file);
          parts = [
              { text: "This is a video audit. I am providing 3 frames (Start, Middle, End) for comprehensive technical analysis." },
              ...frames.map(f => ({ inlineData: { mimeType: 'image/jpeg', data: f } }))
          ];
      } else if (item.type === 'image' && (mimeType.includes('svg') || ext === 'svg')) { 
          parts = [{ inlineData: { mimeType: 'text/plain', data: btoa(await item.file.text()) } }];
          mimeType = 'text/plain';
      } else if (item.type === 'document') {
          parts = [{ inlineData: { mimeType: 'text/plain', data: btoa("Simulated Document data for " + item.name) } }];
          mimeType = 'text/plain';
      } else { 
          const base64Content = await compressImageForAudit(item.file);
          parts = [{ inlineData: { mimeType: 'image/jpeg', data: base64Content } }];
          mimeType = 'image/jpeg';
      }

      const sysPrompt = `Act as an Ultra-Strict Senior Microstock Quality Inspector for Adobe Stock. 
      Analyze the media at a pixel-peeping level for Technical Quality & AI Risk.
      For VIDEO: Analyze the provided frames for temporal stability, flickering, motion artifacts, jitter, and dropped frames.
      For IMAGE/VECTOR: Look for noise, blur, chromatic aberration, and AI structural anomalies.
      Output JSON EXACTLY matching this structure:
      {
        "quality_score": 0-100, "similarity_score": 0-100, "risk_level": "Low" | "Medium" | "High",
        "reject_probability": "0-100%", "adobe_stock_status": "Aman" | "Warning" | "Ditolak",
        "adobe_stock_reason": "Detail reason for status (in Indonesian/English)",
        "similar_content_detail": "Detail about existing similar/duplicate contents on Adobe Stock",
        "issues_id": ["Detailed list of technical issues found in Indonesian."],
        "issues_en": ["Detailed list of technical issues found in English."]
      }`;

      let targetPrompt = "Perform extreme Adobe Stock technical audit.";
      if (mimeType === 'text/plain') targetPrompt += ` Note: The file is a vector/source file named "${item.name}". Assume high technical quality but check for common vector rejection reasons.`;

      const contents = [{ parts: [{ text: targetPrompt }, ...parts] }];
      const config = {
        systemInstruction: sysPrompt,
        responseMimeType: "application/json"
      };
      
      const response = await callGeminiSDK("gemini-3-flash-preview", contents, config);
      return extractCleanJSON(response.text);
  };

  const processQaQueue = async (currentIndex: number, currentQueue: any[]) => {
      if (currentIndex >= currentQueue.length) { setIsAuditingQueue(false); return; }
      const item = currentQueue[currentIndex];
      
      if (item.status === 'done') { processQaQueue(currentIndex + 1, currentQueue); return; }
      if (item.status === 'error') { setIsAuditingQueue(false); return; } 

      setQaQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q));
      setActiveQaId(item.id);

      try {
          const result = await runSingleAudit(item);
          setQaQueue(prev => {
              const newQ = prev.map(q => q.id === item.id ? { ...q, status: 'done', result } : q);
              setTimeout(() => processQaQueue(currentIndex + 1, newQ), 100); 
              return newQ;
          });
      } catch (e: any) { 
          setQaQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: e.message } : q));
          setIsAuditingQueue(false); 
      }
  };

  const handleRetryQa = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setQaQueue(prev => {
          const newQ = prev.map(q => q.id === id ? { ...q, status: 'pending', error: null } : q);
          const idx = newQ.findIndex(q => q.id === id);
          setIsAuditingQueue(true);
          processQaQueue(idx, newQ);
          return newQ;
      });
  };

  const handleStartOrRetryQa = () => {
      if (isAuditingQueue) return;
      const hasPending = qaQueue.some(q => q.status === 'pending');
      if (!hasPending && qaQueue.length > 0) {
          setQaQueue(prev => prev.map(q => ({ ...q, status: 'pending', result: null, error: null })));
          setTimeout(() => {
              setIsAuditingQueue(true);
              setQaQueue(latestQueue => { processQaQueue(0, latestQueue); return latestQueue; });
          }, 50);
      } else {
          setIsAuditingQueue(true);
          setQaQueue(latestQueue => { processQaQueue(0, latestQueue); return latestQueue; });
      }
  };

  const clearQaQueue = () => { if(isAuditingQueue) return; setQaQueue([]); setActiveQaId(null); }

  const activeQaData = qaQueue.find(q => q.id === activeQaId);
  const qaResults = activeQaData ? activeQaData.result : null;
  const currentQaIssues = qaResults ? (lang === 'ID' ? (qaResults.issues_id || qaResults.issues || []) : (qaResults.issues_en || qaResults.issues || [])) : [];

  const isQaAllDoneOrError = qaQueue.length > 0 && !qaQueue.some(q => q.status === 'pending' || q.status === 'processing');

  // ==========================================
  // MODULE 4: MARKET RESEARCH (Trends & Strategy)
  // ==========================================
  const [researchQuery, setResearchQuery] = useState('');
  const [researchMediaType, setResearchMediaType] = useState('All');
  const [researchFilter, setResearchFilter] = useState('Trending Now');
  const [researchResult, setResearchResult] = useState<any>(null);

  const handleResearch = async () => {
      setIsProcessing(true); setError('');
      const query = researchQuery || "Global trending stock content and viral visual themes";
      try {
          const sysPrompt = `Act as a Professional Stock Market Analyst & Content Strategist for Adobe Stock and Shutterstock.
          Provide a deep data-driven analysis for the keyword: "${query}".
          Analyze specifically for media type: "${researchMediaType}" with filter: "${researchFilter}".
          Output JSON EXACTLY matching this structure:
          {
            "market_demand": 0-100, "competition_level": "Low" | "Medium" | "High", "competition_score": 0-100, "profit_potential": 0-100,
            "trend_score": 0-100, "sell_through_rate": "0-100%", "urgency_score": 0-100,
            "analysis_id": "Analisis mendalam tentang permintaan pasar saat ini (dalam Bahasa Indonesia)",
            "analysis_en": "Deep analysis of current market demand (in English)",
            "strategy_id": ["Daftar strategi konten spesifik untuk mendominasi niche ini (Bahasa Indonesia)"],
            "strategy_en": ["List of specific content strategies to dominate this niche (English)"],
            "top_keywords": ["List of 15 high-volume search keywords for this niche"],
            "recommended_styles": ["List of 8 visual styles currently selling best for this niche"],
            "urgent_items": [
              { "item": "Specific subject/theme", "reason": "Why it is urgent", "potential": "High/Extreme", "search_query": "Optimized keywords for Adobe Stock search" }
            ]
          }`;
          const contents = [{ parts: [{ text: `Perform deep market research for: ${query}` }] }];
          const config = { systemInstruction: sysPrompt, responseMimeType: "application/json" };
          const response = await callGeminiSDK("gemini-3-flash-preview", contents, config);
          setResearchResult(extractCleanJSON(response.text));
      } catch (e: any) { setError("Research failed: " + e.message); } finally { setIsProcessing(false); }
  };

  const clearResearch = () => { setResearchResult(null); setResearchQuery(''); }

  return (
    <div className={`min-h-screen transition-all duration-700 selection-red ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'theme-light bg-slate-50 text-slate-900'}`} style={{ backgroundColor: theme === 'dark' ? `rgba(2, 6, 23, ${bgOpacity / 100})` : `rgba(248, 250, 252, ${bgOpacity / 100})` }}>
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* --- HEADER --- */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-[1400px]">
        <header className="backdrop-blur-xl bg-slate-900/90 border border-slate-800/50 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-2xl gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button onClick={() => setActiveTab('t2i')} className="flex items-center gap-2 md:gap-3 group">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white fill-white/20" />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-sm md:text-lg font-black tracking-tighter leading-none flex items-center gap-1.5">
                  STUDIO <span className="bg-indigo-600 text-[8px] md:text-[9px] px-1.5 py-0.5 rounded text-white font-bold tracking-normal">PRO</span>
                </h1>
              </div>
            </button>

            <div className="flex items-center gap-2 md:hidden">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-400">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold">
                {lang}
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 't2i', label: 'T2I', icon: ImageIcon },
              { id: 'i2i', label: 'I2I', icon: FileImage },
              { id: 'analysis', label: 'Metadata', icon: ScanEye },
              { id: 'qa_check', label: 'Audit', icon: ShieldAlert },
              { id: 'research', label: 'Market', icon: Flame },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 't2i' || tab.id === 'i2i') setGenMode(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className={activeTab === tab.id ? 'block' : 'hidden sm:block'}>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 md:gap-4">
            {/* View Mode Toggle */}
            <div className="hidden lg:flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setViewMode('desktop')} className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`} title="Desktop View"><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('tablet')} className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`} title="Tablet View"><ChevronDown className="w-4 h-4 rotate-90" /></button>
              <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`} title="Mobile View"><ChevronDown className="w-4 h-4" /></button>
            </div>

            <div className="h-6 w-px bg-slate-800/50 hidden lg:block" />

            {/* Opacity Control */}
            <div className="relative" ref={opacityRef}>
              <button onClick={() => setShowOpacity(!showOpacity)} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors text-gray-400 hover:text-current shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              {showOpacity && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl z-50 animate-slide-down">
                  <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-bold text-gray-500 uppercase">UI Opacity</span><span className="text-xs font-bold">{bgOpacity}%</span></div>
                  <input type="range" min="10" max="100" value={bgOpacity} onChange={(e) => setBgOpacity(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
                </div>
              )}
            </div>
            
            <button onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all text-xs font-bold shadow-sm">
               <Globe className="w-4 h-4 text-indigo-500" /> {lang}
            </button>

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all text-gray-400 hover:text-current shadow-sm">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>
      </div>

      <main className={`relative z-10 pt-40 md:pt-32 pb-12 px-4 md:px-6 mx-auto transition-all duration-500 ${viewMode === 'mobile' ? 'max-w-[450px]' : viewMode === 'tablet' ? 'max-w-[850px]' : 'max-w-[1600px]'}`}>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            <button onClick={() => setError('')} className="ml-auto hover:bg-red-500/20 p-1 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 1: AI GENERATOR */}
        {/* ========================================== */}
        {(activeTab === 't2i' || activeTab === 'i2i') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Panel: Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Sparkles className="w-4 h-4"/> {t.tabGen}</h2>
                </div>

                <div className="space-y-5">
                  {genMode === 'i2i' && (
                    <div className="animate-slide-down">
                       <UploadMini icon={ImageIcon} label={isAnalyzingImage ? "ANALYZING..." : t.upImg} previewUrl={refImage} onUpload={handleRefImageUpload} onClear={() => setRefImage(null)} accept="image/*" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5"><PenTool className="w-4 h-4 text-indigo-500"/> {t.prompt}</label>
                      <button onClick={handleAutoInspiration} disabled={isProcessing} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase hover:bg-yellow-500 hover:text-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed" title="Auto Inspiration">
                        <Lightbulb className="w-3 h-3 fill-current" /> AUTO
                      </button>
                    </div>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.promptPlaceholder} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 h-32 resize-none transition-all placeholder:text-gray-600 custom-scrollbar" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-indigo-500"/> {t.ratio}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(RESOLUTIONS).map(res => (
                          <button key={res} onClick={() => setResolutionKey(res)} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${resolutionKey === res ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-950/50 border-slate-800 text-gray-500 hover:border-slate-700'}`}>{res}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5"><Layers className="w-4 h-4 text-indigo-500"/> {t.batch}</label>
                      <input type="number" min="1" max="4" value={batchCount} onChange={(e) => setBatchCount(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 font-bold" />
                    </div>
                  </div>

                  <SmartDropdown title={t.visualStyle} icon={Palette} list={ART_STYLES} selectedMulti={selStylesMulti} setSelectedMulti={setSelStylesMulti} selectedSingle={selStyleSingle} setSelectedSingle={setSelStyleSingle} isMultiMode={styleModeMulti} setIsMultiMode={setStyleModeMulti} customValue={customStyleText} setCustomValue={setCustomStyleText} lang={lang} />
                  <SmartDropdown title={t.cameraAngle} icon={ScanEye} list={CAMERA_ANGLES} selectedMulti={selAnglesMulti} setSelectedMulti={setSelAnglesMulti} selectedSingle={selAngleSingle} setSelectedSingle={setSelAngleSingle} isMultiMode={angleModeMulti} setIsMultiMode={setAngleModeMulti} customValue={customAngleText} setCustomValue={setCustomAngleText} lang={lang} />
                  <SmartDropdown title={t.seamlessLoop} icon={RefreshCw} list={LOOP_STYLES} selectedSingle={selLoopSingle} setSelectedSingle={setSelLoopSingle} customValue={customLoopText} setCustomValue={setCustomLoopText} lang={lang} forceSingle={true} />

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all">
                        <option value="Image">Image</option>
                        <option value="Background">Background</option>
                        <option value="Vector">Vector</option>
                        <option value="Video">Video</option>
                        <option value="Illustration">Illustration</option>
                        <option value="Texture">Texture</option>
                      </select>
                    </div>
                    <button onClick={handleGenerate} disabled={isProcessing} className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                      {isProcessing ? t.processing : t.btnGen}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 min-h-[600px] flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><Grid className="w-4 h-4"/> {t.results}</h2>
                    <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-400">{generatedImages.length} ITEMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={genTargetExt} onChange={(e) => setGenTargetExt(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none focus:border-indigo-500">
                       {GEN_FORMATS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
                    <button onClick={clearImages} className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {generatedImages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30">
                    <ImageIcon className="w-24 h-24 mb-6" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t.noResults}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-up">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg">
                        <div className="aspect-[3/2] relative overflow-hidden bg-slate-900">
                          {img.type === 'video' ? (
                            <video src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay muted loop playsInline />
                          ) : (
                            <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <button onClick={() => setActiveModal({ show: true, mode: 'view', index: idx, url: img.url })} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 md:p-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center transition-all" title={t.viewImg}><Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                              {img.type !== 'video' && (
                                <button onClick={() => setActiveModal({ show: true, mode: 'revise', index: idx, url: img.url })} className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-all"><Wand2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> REVISE</button>
                              )}
                              <button onClick={() => handleDownloadFormat(img.url, idx, img.resKey, img.type === 'video' ? 'MP4' : genTargetExt.replace('.', '').toUpperCase())} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-all shadow-lg"><Download className="w-3 h-3 md:w-3.5 md:h-3.5" /> {img.type === 'video' ? 'MP4' : genTargetExt.toUpperCase()}</button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
                           <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Resolution</span><span className="text-xs font-bold">{RESOLUTIONS[img.resKey as keyof typeof RESOLUTIONS].w}x{RESOLUTIONS[img.resKey as keyof typeof RESOLUTIONS].h}</span></div>
                           <div className="flex items-center gap-2">
                              <div className="relative group/json">
                                <button className="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"><Code className="w-4 h-4"/></button>
                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl opacity-0 invisible group-hover/json:opacity-100 group-hover/json:visible transition-all z-20">
                                   <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-indigo-500 uppercase">Video Prompt JSON</span><CopyButton text={img.videoJson} tooltipText="JSON" /></div>
                                   <pre className="text-[10px] text-gray-400 font-mono overflow-x-auto custom-scrollbar max-h-40">{img.videoJson}</pre>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: STOCK METADATA */}
        {/* ========================================== */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Queue Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col h-[700px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Archive className="w-4 h-4"/> {t.queue}</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={clearMetaQueue} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {metaQueue.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30 text-center p-6">
                      <Upload className="w-12 h-12 mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">{t.upImg}</p>
                    </div>
                  ) : (
                    metaQueue.map((item) => (
                      <div key={item.id} onClick={() => setActiveMetaId(item.id)} className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${activeMetaId === item.id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}>
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          {item.preview === 'document' ? <div className="w-full h-full flex items-center justify-center text-emerald-500 bg-slate-800"><FileText className="w-6 h-6"/></div> : <img src={item.preview} className="w-full h-full object-cover" alt="Thumb" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-gray-300">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             {item.status === 'processing' && <span className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase"><Loader2 className="w-3 h-3 animate-spin"/> {t.processing}</span>}
                             {item.status === 'done' && <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase"><CheckCircle2 className="w-3 h-3"/> DONE</span>}
                             {item.status === 'pending' && <span className="text-[9px] font-black text-gray-500 uppercase">PENDING</span>}
                             {item.status === 'error' && <button onClick={(e) => handleRetryMeta(item.id, e)} className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase hover:underline"><AlertTriangle className="w-3 h-3"/> RETRY</button>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-6 space-y-4">
                  <div className="space-y-4 bg-slate-950/50 p-5 rounded-3xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">SEO Configuration</h3>
                      <button onClick={() => { setMetaInstructions(''); setMetaKeywords(''); setMetaCategory(''); }} className="text-[9px] font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase">Clear All</button>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                         <span>Instructions</span>
                         <button onClick={async () => {
                            if(metaQueue.length === 0) return;
                            setIsExtractingQueue(true);
                            try {
                              const item = metaQueue[0];
                              let base64Data = "";
                              if (item.type === 'video') {
                                 const thumbDataUrl = await generateVideoThumbnail(item.file);
                                 base64Data = thumbDataUrl.split(',')[1] || "";
                              } else if (item.type === 'image' && item.file.type.includes('svg')) { base64Data = btoa(await item.file.text()); } 
                              else { base64Data = await new Promise((res) => { const r = new FileReader(); r.onloadend = () => res((r.result as string).split(',')[1]); r.readAsDataURL(item.file); }); }
                              
                              const contents = [{ parts: [{ text: "Suggest the best Adobe Stock SEO instructions, keywords, and category for this image. Output JSON: { \"instructions\": \"...\", \"keywords\": \"...\", \"category\": \"...\" }" }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }];
                              const response = await callGeminiSDK("gemini-3-flash-preview", contents, { responseMimeType: "application/json" });
                              const json = extractCleanJSON(response.text);
                              if(json.instructions) setMetaInstructions(json.instructions);
                              if(json.keywords) setMetaKeywords(json.keywords);
                              if(json.category) setMetaCategory(json.category);
                            } catch(e) {} finally { setIsExtractingQueue(false); }
                         }} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all border border-yellow-500/20 group">
                           <Lightbulb className="w-3 h-3 fill-yellow-500 group-hover:scale-110 transition-transform" />
                           <span className="text-[9px] font-black">AUTO SEO</span>
                         </button>
                       </label>
                       <textarea value={metaInstructions} onChange={(e) => setMetaInstructions(e.target.value)} placeholder="e.g. Focus on vibrant colors, minimalist composition, commercial style..." className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 h-20 resize-none transition-all placeholder:text-slate-700" />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Keywords</label>
                       <textarea value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="Enter specific keywords to prioritize (comma separated)..." className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 h-20 resize-none transition-all placeholder:text-slate-700" />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                         <span>Category</span>
                         <span className="text-[8px] text-slate-600 font-normal normal-case italic">Auto-detect if empty</span>
                       </label>
                       <textarea value={metaCategory} onChange={(e) => setMetaCategory(e.target.value)} placeholder="e.g. landscapes, people, technology..." className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 h-12 resize-none transition-all placeholder:text-slate-700" />
                       <p className="text-[8px] text-slate-600 leading-tight">
                         Available: animal, building and architecture, business, drinks, environment, state of mind, food, graphic resources, hobbies, industry, landscapes, lifestyle, people, plants, religion, science, social, sport, technology, transport, travel.
                       </p>
                    </div>
                  </div>

                  <div className="relative">
                    <input type="file" multiple onChange={handleAddMetaFiles} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*,video/*,.eps,.ai,.psd" />
                    <button className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700">
                      <Plus className="w-4 h-4" /> {t.upImg}
                    </button>
                  </div>
                  <button onClick={handleStartOrRetryMeta} disabled={isExtractingQueue || metaQueue.length === 0} className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isExtractingQueue || metaQueue.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'}`}>
                    {isExtractingQueue ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                    {isExtractingQueue ? t.processing : t.btnMeta}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Detail */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 min-h-[700px] flex flex-col shadow-xl backdrop-blur-sm">
                {!activeMetaData ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30">
                    <ScanEye className="w-24 h-24 mb-6" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t.noResults}</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                          {activeMetaData.preview === 'document' ? 
                             <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500 bg-slate-800/50"><FileText className="w-16 h-16 mb-4"/><span className="text-xs font-bold text-gray-500">{activeMetaData.name}</span></div> : 
                             (activeMetaData.type === 'video' ? <video src={activeMetaData.videoSrc || activeMetaData.preview} className="w-full h-full object-contain" controls /> : <img src={activeMetaData.preview} className="w-full h-full object-contain" alt="Main" />)
                          }
                       </div>
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center justify-between">
                             <h2 className="text-xl font-black tracking-tight">{activeMetaData.name}</h2>
                             <div className="flex items-center gap-2">
                                <select value={metaTargetExt} onChange={(e) => setMetaTargetExt(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none focus:border-indigo-500">
                                   {META_FORMATS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                                </select>
                                <button onClick={handleExportCsvActive} disabled={!stockData} className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-30"><FileSpreadsheet className="w-4 h-4"/></button>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Type</span>
                                <span className="text-sm font-bold text-indigo-400 uppercase">{activeMetaData.type}</span>
                             </div>
                             <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Category</span>
                                <span className="text-sm font-bold text-emerald-400 uppercase">{stockData?.category || '---'}</span>
                             </div>
                          </div>

                          <div className="space-y-2">
                             <div className="flex items-center justify-between"><label className="text-xs font-bold text-gray-400 uppercase">Generated Filename</label><CopyButton text={stockData?.filename} tooltipText="Name" /></div>
                             <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm font-mono text-indigo-300">{stockData?.filename || '---'}</div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-3">
                          <div className="flex items-center justify-between"><label className="text-xs font-bold text-gray-400 uppercase">Commercial Description ({lang})</label><CopyButton text={currentStockDesc} tooltipText="Desc" targetId="meta-desc-area" /></div>
                          <textarea id="meta-desc-area" readOnly value={currentStockDesc} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm outline-none h-24 resize-none transition-all placeholder:text-gray-700 custom-scrollbar" placeholder="Waiting for analysis..." />
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                             <label className="text-xs font-bold text-gray-400 uppercase">Keywords (30 Tags)</label>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-600">{stockData?.keywords ? stockData.keywords.split(',').length : 0}/30</span>
                                <CopyButton text={stockData?.keywords} tooltipText="Tags" targetId="meta-tags-area" />
                             </div>
                          </div>
                          <textarea id="meta-tags-area" readOnly value={stockData?.keywords || ''} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-xs outline-none h-32 resize-none transition-all font-mono text-gray-400 custom-scrollbar" placeholder="Waiting for keywords..." />
                       </div>
                    </div>

                    {isMetaAllDoneOrError && (
                      <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-4">
                            <Building2 className="w-8 h-8 text-indigo-500 opacity-50" />
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-gray-500 uppercase">Target Agency Format</span>
                               <select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)} className="bg-transparent text-sm font-black outline-none text-indigo-400">
                                  {Object.keys(AGENCY_FORMATS).map(a => <option key={a} value={a}>{a}</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={handleExportCsvAll} className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"><FileSpreadsheet className="w-4 h-4"/> EXPORT CSV (ALL)</button>
                            <button onClick={handleExportZipAll} className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"><Archive className="w-4 h-4"/> EXPORT ZIP (ALL)</button>
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: TECHNICAL AUDIT */}
        {/* ========================================== */}
        {activeTab === 'qa_check' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Queue Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col h-[700px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Activity className="w-4 h-4"/> {t.queue}</h2>
                  <button onClick={clearQaQueue} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {qaQueue.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30 text-center p-6">
                      <ShieldAlert className="w-12 h-12 mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">{t.upImg}</p>
                    </div>
                  ) : (
                    qaQueue.map((item) => (
                      <div key={item.id} onClick={() => setActiveQaId(item.id)} className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${activeQaId === item.id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}>
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          {item.preview === 'document' ? <div className="w-full h-full flex items-center justify-center text-emerald-500 bg-slate-800"><FileText className="w-6 h-6"/></div> : <img src={item.preview} className="w-full h-full object-cover" alt="Thumb" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-gray-300">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             {item.status === 'processing' && <span className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase"><Loader2 className="w-3 h-3 animate-spin"/> AUDITING...</span>}
                             {item.status === 'done' && <span className={`flex items-center gap-1 text-[9px] font-black uppercase ${item.result?.risk_level === 'High' ? 'text-red-500' : 'text-emerald-500'}`}><CheckCircle2 className="w-3 h-3"/> {item.result?.adobe_stock_status || 'DONE'}</span>}
                             {item.status === 'pending' && <span className="text-[9px] font-black text-gray-500 uppercase">PENDING</span>}
                             {item.status === 'error' && <button onClick={(e) => handleRetryQa(item.id, e)} className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase hover:underline"><AlertTriangle className="w-3 h-3"/> RETRY</button>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-6 space-y-4">
                  <div className="relative">
                    <input type="file" multiple onChange={handleAddQaFiles} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*,video/*,.eps,.ai,.psd" />
                    <button className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700">
                      <Plus className="w-4 h-4" /> {t.upImg}
                    </button>
                  </div>
                  <button onClick={handleStartOrRetryQa} disabled={isAuditingQueue || qaQueue.length === 0} className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isAuditingQueue || qaQueue.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'}`}>
                    {isAuditingQueue ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
                    {isAuditingQueue ? 'AUDITING...' : t.btnAudit}
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Detail */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 min-h-[700px] flex flex-col shadow-xl backdrop-blur-sm">
                {!activeQaData ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30">
                    <Activity className="w-24 h-24 mb-6" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t.noResults}</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                          {activeQaData.preview === 'document' ? 
                             <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500 bg-slate-800/50"><FileText className="w-16 h-16 mb-4"/><span className="text-xs font-bold text-gray-500">{activeQaData.name}</span></div> : 
                             (activeQaData.type === 'video' ? <video src={activeQaData.videoSrc || activeQaData.preview} className="w-full h-full object-contain" controls /> : <img src={activeQaData.preview} className="w-full h-full object-contain" alt="Main" />)
                          }
                       </div>
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center justify-between">
                             <h2 className="text-xl font-black tracking-tight">{activeQaData.name}</h2>
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${qaResults?.risk_level === 'High' ? 'bg-red-500/10 border-red-500 text-red-500' : (qaResults?.risk_level === 'Medium' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500')}`}>
                                RISK: {qaResults?.risk_level || '---'}
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                             <ScoreMeter value={qaResults?.quality_score || 0} label="Quality" colorClass={qaResults?.quality_score > 70 ? "text-emerald-500" : "text-amber-500"} />
                             <ScoreMeter value={qaResults?.similarity_score || 0} label="Similarity" colorClass={qaResults?.similarity_score > 50 ? "text-red-500" : "text-emerald-500"} />
                             <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <span className="text-2xl font-black text-indigo-400">{qaResults?.reject_probability || '0%'}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase text-center">Rejection Prob.</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Target className="w-4 h-4"/> Adobe Stock Verdict</h3>
                          <div className={`p-6 rounded-2xl border-2 ${qaResults?.adobe_stock_status === 'Ditolak' ? 'bg-red-500/10 border-red-500/50' : (qaResults?.adobe_stock_status === 'Warning' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/50')}`}>
                             <div className="flex items-center gap-3 mb-3">
                                {qaResults?.adobe_stock_status === 'Ditolak' ? <XCircle className="w-6 h-6 text-red-500"/> : (qaResults?.adobe_stock_status === 'Warning' ? <AlertTriangle className="w-6 h-6 text-amber-500"/> : <CheckCircle2 className="w-6 h-6 text-emerald-500"/>)}
                                <span className="text-lg font-black uppercase tracking-tight">{qaResults?.adobe_stock_status || 'WAITING...'}</span>
                             </div>
                             <p className="text-sm font-medium text-gray-300 leading-relaxed">{qaResults?.adobe_stock_reason || 'Run audit to see detailed status.'}</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Technical Issues</h3>
                          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 min-h-[150px]">
                             {currentQaIssues.length === 0 ? (
                                <p className="text-sm text-gray-600 italic">No major technical issues detected.</p>
                             ) : (
                                <ul className="space-y-3">
                                   {currentQaIssues.map((issue: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm font-medium text-gray-400">
                                         <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {issue}
                                      </li>
                                   ))}
                                </ul>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Market Similarity Detail</h3>
                       <p className="text-sm font-medium text-gray-400 leading-relaxed">{qaResults?.similar_content_detail || 'No similar content data available yet.'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ========================================== */}
        {/* TAB 4: MARKET RESEARCH */}
        {/* ========================================== */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Search Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Search className="w-4 h-4"/> {t.tabRes}</h2>
                  <button onClick={clearResearch} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-gray-500"><RefreshCw className="w-4 h-4" /></button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5"><Target className="w-4 h-4 text-indigo-500"/> {t.search}</label>
                    <div className="relative">
                       <input type="text" value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} placeholder="e.g., Cyberpunk City, Sustainable Energy, Remote Work..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">{t.mediaType}</label>
                      <select value={researchMediaType} onChange={(e) => setResearchMediaType(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500">
                         {MEDIA_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Filter</label>
                      <select value={researchFilter} onChange={(e) => setResearchFilter(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500">
                         {RESEARCH_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={handleResearch} disabled={isProcessing} className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'}`}>
                      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                      {isProcessing ? 'ANALYZING...' : t.btnRes}
                    </button>
                  </div>
                </div>
              </div>

              {researchResult && (
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-6 animate-slide-down">
                   <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><Cpu className="w-4 h-4"/> Recommended Styles</h3>
                   <div className="flex flex-wrap gap-2">
                      {researchResult.recommended_styles?.map((style: string, idx: number) => (
                         <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-lg text-[10px] font-bold uppercase">{style}</span>
                      ))}
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Target className="w-4 h-4"/> High-Volume Keywords</h3>
                   <div className="flex flex-wrap gap-2">
                      {researchResult.top_keywords?.map((kw: string, idx: number) => (
                         <a 
                           key={idx} 
                           href={`https://stock.adobe.com/search?k=${encodeURIComponent(kw)}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 rounded-lg text-[10px] font-bold lowercase hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5"
                         >
                           {kw}
                           <ExternalLink className="w-2.5 h-2.5" />
                         </a>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Research Result Panel */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 min-h-[700px] flex flex-col shadow-xl backdrop-blur-sm">
                {!researchResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30">
                    <TrendingUp className="w-24 h-24 mb-6" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t.noResults}</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                          <span className="text-gray-500">Market Analysis:</span> {researchQuery || "Global Trending"}
                       </h2>
                       <div className="flex items-center gap-4">
                          <a 
                            href={`https://stock.adobe.com/search?k=${encodeURIComponent(researchQuery || "trending")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-500 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            <ExternalLink className="w-3 h-3" /> {t.viewOnAdobe}
                          </a>
                          <div className="w-px h-8 bg-slate-800" />
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-bold text-gray-500 uppercase">Trend Score</span>
                             <span className="text-xl font-black text-indigo-500">{researchResult.trend_score}/100</span>
                          </div>
                          <div className="w-px h-8 bg-slate-800" />
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-bold text-gray-500 uppercase">STR</span>
                             <span className="text-xl font-black text-emerald-500">{researchResult.sell_through_rate}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                       <ScoreMeter value={researchResult.market_demand || 0} label={t.demand} colorClass="text-indigo-500" />
                       <ScoreMeter value={researchResult.competition_score || 0} label={t.competition} colorClass={researchResult.competition_score > 70 ? "text-red-500" : (researchResult.competition_score > 40 ? "text-amber-500" : "text-emerald-500")} />
                       <ScoreMeter value={researchResult.urgency_score || 0} label={t.urgency} colorClass="text-emerald-500" />
                    </div>

                    {researchResult.urgent_items && researchResult.urgent_items.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2 animate-pulse">
                          <AlertTriangle className="w-4 h-4"/> URGENT MARKET OPPORTUNITIES
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {researchResult.urgent_items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap className="w-12 h-12 text-red-500" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-red-500 uppercase tracking-tight">{item.item}</span>
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={`https://stock.adobe.com/search?k=${encodeURIComponent(item.search_query || item.item)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                                    title="View on Adobe Stock"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase">{item.potential} POTENTIAL</span>
                                </div>
                              </div>
                              <p className="text-xs font-medium text-gray-400 leading-relaxed">{item.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                       <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Info className="w-4 h-4"/> Strategic Analysis</h3>
                       <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                          <p className="text-base font-medium text-gray-300 leading-relaxed italic">
                             "{lang === 'ID' ? researchResult.analysis_id : researchResult.analysis_en}"
                          </p>
                          <div className="h-px bg-slate-800 w-full" />
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Recommended Content Strategy</h4>
                             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(lang === 'ID' ? researchResult.strategy_id : researchResult.strategy_en)?.map((strat: string, idx: number) => (
                                   <li key={idx} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 text-sm font-medium text-gray-400">
                                      <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-500 flex items-center justify-center text-[10px] font-black shrink-0">{idx + 1}</div>
                                      {strat}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 pt-4">
                       <div className="flex items-center gap-2 text-gray-500">
                          <Building2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Data Source: Adobe Stock Insights</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-500">
                          <Activity className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Last Updated: Real-time</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/60 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                  {activeModal.mode === 'revise' ? <><Wand2 className="w-4 h-4"/> REVISE IMAGE</> : <><ImageIcon className="w-4 h-4"/> {t.viewImg}</>}
                </h3>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 max-h-[80vh]">
                <div className={`${activeModal.mode === 'view' ? 'aspect-auto max-h-[60vh]' : 'aspect-video'} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950`}>
                   {generatedImages[activeModal.index]?.type === 'video' ? (
                     <video src={activeModal.url} className="w-full h-full object-contain" controls autoPlay />
                   ) : (
                     <img src={activeModal.url} className="w-full h-full object-contain" alt="Modal View" />
                   )}
                </div>
                {activeModal.mode === 'revise' && (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase">What would you like to change?</label>
                      <textarea value={revisionPrompt} onChange={(e) => setRevisionPrompt(e.target.value)} placeholder="e.g., Change the background to a sunset, add more flowers, make it look like an oil painting..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 h-24 resize-none transition-all" />
                    </div>
                    <button onClick={handleRevision} disabled={isRevising || !revisionPrompt} className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isRevising || !revisionPrompt ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'}`}>
                      {isRevising ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                      {isRevising ? 'REVISING...' : 'APPLY REVISION'}
                    </button>
                  </>
                )}
                {activeModal.mode === 'view' && (
                  <div className="flex items-center gap-4">
                    <button onClick={() => setActiveModal(prev => ({ ...prev, mode: 'revise' }))} className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700">
                      <Wand2 className="w-4 h-4" /> {t.editImg}
                    </button>
                    <button onClick={() => handleDownloadFormat(activeModal.url, activeModal.index, generatedImages[activeModal.index].resKey, generatedImages[activeModal.index].type === 'video' ? 'MP4' : genTargetExt.replace('.', '').toUpperCase())} className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg">
                      <Download className="w-4 h-4" /> {generatedImages[activeModal.index].type === 'video' ? 'DOWNLOAD MP4' : t.downloadHD}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-center">
                <button onClick={() => setActiveModal({ show: false, mode: '', index: -1, url: '' })} className="flex items-center gap-2 px-8 py-3 bg-red-600/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all">
                  <X className="w-4 h-4"/> {t.closeImg}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
