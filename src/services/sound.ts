/**
 * Synthesizes a gentle, calming Tibetan singing bowl / temple chime tone
 * using Web Audio API (zero external assets required).
 */
export function playSereneChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic frequencies resembling a singing bowl / sacred bell
    const baseFreq = 432; // Sacred healing frequency A = 432Hz
    const harmonics = [1, 2.02, 3.01, 4.05];
    const gains = [0.15, 0.08, 0.04, 0.02];

    harmonics.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      gainNode.gain.setValueAtTime(0, now);
      // Gentle attack
      gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.08);
      // Long serene exponential decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}
