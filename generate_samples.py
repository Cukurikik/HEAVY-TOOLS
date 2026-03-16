import wave
import struct
import math

def generate_wav(filename, duration, sample_rate, func):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)

        num_samples = int(duration * sample_rate)

        for i in range(num_samples):
            t = i / sample_rate
            val = func(t, i, num_samples)
            # soft clip
            val = max(-1.0, min(1.0, val))
            sample = int(val * 32767.0)
            wav_file.writeframes(struct.pack('<h', sample))

def kick(t, i, num_samples):
    freq = 150 * math.exp(-t * 20)
    env = math.exp(-t * 10)
    return math.sin(2 * math.pi * freq * t) * env * 0.9

def snare(t, i, num_samples):
    import random
    env = math.exp(-t * 15)
    noise = (random.random() * 2 - 1) * env
    tone = math.sin(2 * math.pi * 200 * t) * math.exp(-t * 30)
    return (noise * 0.6 + tone * 0.4)

def hihat(t, i, num_samples):
    import random
    env = math.exp(-t * 40)
    noise = (random.random() * 2 - 1) * env
    return noise * 0.5

def synth_bass(t, i, num_samples):
    freq = 55.0 # A1
    env = math.exp(-t * 3)
    val = math.sin(2 * math.pi * freq * t)
    # add some saw
    val += (2 * (t * freq - math.floor(t * freq + 0.5))) * 0.5
    return val * env * 0.5

def synth_chord(t, i, num_samples):
    freq = 220.0 # A3
    env = math.sin(math.pi * (i/num_samples))
    val = math.sin(2 * math.pi * freq * t) * 0.5 + math.sin(2 * math.pi * freq * 1.5 * t) * 0.25
    return val * env * 0.4

generate_wav('public/samples/drums/kick.wav', 0.5, 44100, kick)
generate_wav('public/samples/drums/snare.wav', 0.5, 44100, snare)
generate_wav('public/samples/drums/hihat.wav', 0.1, 44100, hihat)
generate_wav('public/samples/bass/bass.wav', 1.0, 44100, synth_bass)
generate_wav('public/samples/synths/chord.wav', 2.0, 44100, synth_chord)

print("Generated sample packs.")
