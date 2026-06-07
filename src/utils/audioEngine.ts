let audioContext: AudioContext | null = null;

type PlayMode = "single" | "sequence" | "together";

export function getFrequency(note: string, octave = 4): number {
  const pitchClass = getPitchClass(note);
  const midi = (octave + 1) * 12 + pitchClass;
  return 440 * 2 ** ((midi - 69) / 12);
}

export async function playSingle(frequency: number) {
  await playFrequencies([frequency], "single");
}

export async function playSequence(frequencies: number[]) {
  await playFrequencies(frequencies, "sequence");
}

export async function playTogether(frequencies: number[]) {
  await playFrequencies(frequencies, "together");
}

export async function playRhythmPattern(pattern: string, bpm = 84) {
  const context = getAudioContext();
  await context.resume();

  const stepDuration = 60 / bpm / 4;
  const normalizedPattern = normalizePattern(pattern);
  const start = context.currentTime + 0.04;

  normalizedPattern.forEach((step, index) => {
    schedulePercussionClick(context, start + index * stepDuration, step === "X");
  });
}

async function playFrequencies(frequencies: number[], mode: PlayMode) {
  const context = getAudioContext();
  await context.resume();

  if (mode === "together") {
    frequencies.forEach((frequency) => schedulePianoTone(context, frequency, context.currentTime, 0.9));
    return;
  }

  frequencies.forEach((frequency, index) => {
    const start = context.currentTime + (mode === "sequence" ? index * 0.72 : 0);
    schedulePianoTone(context, frequency, start, 0.68);
  });
}

function schedulePianoTone(context: AudioContext, frequency: number, start: number, duration: number) {
  const output = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, start);
  filter.frequency.exponentialRampToValueAtTime(900, start + duration);

  output.gain.setValueAtTime(0.0001, start);
  output.gain.exponentialRampToValueAtTime(0.24, start + 0.018);
  output.gain.exponentialRampToValueAtTime(0.08, start + 0.24);
  output.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  [1, 2, 3].forEach((multiple, index) => {
    const oscillator = context.createOscillator();
    const harmonicGain = context.createGain();
    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency * multiple, start);
    harmonicGain.gain.setValueAtTime([0.9, 0.22, 0.08][index], start);
    oscillator.connect(harmonicGain).connect(filter);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  });

  filter.connect(output).connect(context.destination);
}

function schedulePercussionClick(context: AudioContext, start: number, accented: boolean) {
  const oscillator = context.createOscillator();
  const noise = context.createOscillator();
  const toneGain = context.createGain();
  const noiseGain = context.createGain();
  const output = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(accented ? 1500 : 820, start);
  oscillator.frequency.exponentialRampToValueAtTime(accented ? 520 : 380, start + 0.055);

  noise.type = "triangle";
  noise.frequency.setValueAtTime(accented ? 110 : 82, start);

  toneGain.gain.setValueAtTime(accented ? 0.18 : 0.055, start);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, start + (accented ? 0.065 : 0.045));
  noiseGain.gain.setValueAtTime(accented ? 0.08 : 0.035, start);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(300, start);
  output.gain.setValueAtTime(0.75, start);

  oscillator.connect(toneGain).connect(filter);
  noise.connect(noiseGain).connect(filter);
  filter.connect(output).connect(context.destination);
  oscillator.start(start);
  noise.start(start);
  oscillator.stop(start + 0.08);
  noise.stop(start + 0.08);
}

function getAudioContext(): AudioContext {
  if (audioContext) return audioContext;

  audioContext = new AudioContext();
  return audioContext;
}

function getPitchClass(note: string): number {
  const normalized = note.trim().replace(/♯/g, "#").replace(/♭/g, "b");
  const letter = normalized.charAt(0).toUpperCase();
  const base: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  const offset = normalized
    .slice(1)
    .split("")
    .reduce((sum, accidental) => {
      if (accidental === "#") return sum + 1;
      if (accidental === "b") return sum - 1;
      return sum;
    }, 0);

  return ((base[letter] + offset) % 12 + 12) % 12;
}

function normalizePattern(pattern: string): string[] {
  const compact = pattern.replace(/\s+/g, "").slice(0, 16);
  return Array.from({ length: 16 }, (_, index) => (compact[index] === "X" || compact[index] === "x" ? "X" : "."));
}
