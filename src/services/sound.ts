// Subtle Web Audio API sound synthesizer for interactive developer feedback

export type SoundProfile = 'cherry' | 'sonar' | 'topre';

class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private profile: SoundProfile = 'cherry';

  constructor() {
    try {
      const saved = localStorage.getItem('sound_haptics_enabled');
      this.enabled = saved === 'true';
      const savedProfile = localStorage.getItem('sound_profile') as SoundProfile;
      if (savedProfile && ['cherry', 'sonar', 'topre'].includes(savedProfile)) {
        this.profile = savedProfile;
      }
    } catch {
      this.enabled = false;
    }

    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem('sound_haptics_enabled', val ? 'true' : 'false');
    } catch {}
    if (val) this.initCtx();
  }

  public getProfile(): SoundProfile {
    return this.profile;
  }

  public setProfile(p: SoundProfile) {
    this.profile = p;
    try {
      localStorage.setItem('sound_profile', p);
    } catch {}
  }

  public getContext(): AudioContext | null {
    this.initCtx();
    return this.ctx;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick(freq = 140, duration = 0.02) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.profile === 'sonar') {
        // High harmonic ping with gentle decay
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 3, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration * 4);
      } else if (this.profile === 'topre') {
        // Muffled tactile thud with low-pass filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.7, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 1.5);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration * 1.5);
      } else {
        // Default 'cherry': Crisp mechanical switch click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      }
    } catch {}
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playClick(320, 0.04);
    setTimeout(() => this.playClick(440, 0.06), 40);
  }

  public playAlert() {
    if (!this.enabled) return;
    this.playClick(100, 0.05);
    setTimeout(() => this.playClick(80, 0.08), 50);
  }
}

export const soundService = new SoundService();
