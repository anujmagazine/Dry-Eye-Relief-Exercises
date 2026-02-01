
import { GoogleGenAI, Modality } from "@google/genai";

// Utility to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Utility to decode PCM audio data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiVoiceService {
  private ai: GoogleGenAI;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Source might already be stopped
      }
      this.currentSource = null;
    }
  }

  async speak(text: string) {
    try {
      this.stop(); // Stop any existing audio before starting new one
      
      const ctx = this.initAudio();
      
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say gently and slowly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) return;

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        ctx,
        24000,
        1
      );

      // Re-check after async TTS call to avoid racing multiple speak calls
      this.stop();

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      this.currentSource = source;
      
      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
      };
    } catch (error) {
      console.error("TTS Error:", error);
    }
  }
}

export const voiceService = new GeminiVoiceService();
