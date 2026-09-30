// Subtle Web Audio API sound synthesizer for interactive developer feedback

class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('sound_haptics_enabled');
      this.enabled = saved === 'true';
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

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
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
