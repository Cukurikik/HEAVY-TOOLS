import os
import uuid
import logging

try:
    import numpy as np
    import librosa
    import soundfile as sf
except ImportError:
    np = None
    sf = None

logger = logging.getLogger(__name__)

class AudioProcessor:
    """
    Digital Signal Processing (DSP) Utilities.
    Handles converting neural network latents into playable audio formats,
    applying Vocoders (like HiFi-GAN), normalizing, and saving to disk.
    """
    
    def __init__(self, sample_rate=32000):
        self.sample_rate = sample_rate
        self.output_dir = os.path.join(os.path.dirname(__file__), "outputs")
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info("DSP AudioProcessor initialized.")

    def apply_vocoder(self, latents: list) -> list:
        """
        Converts abstract model latents (Spectrograms) back into raw audio waveforms 
        using a Neural Vocoder. 
        """
        # Simulated vocoder step
        return latents

    def normalize_audio(self, audio_data: list) -> list:
        """
        Normalizes peak amplitude to prevent clipping and ensure consistent volume.
        """
        if not np:
            return audio_data
            
        audio_np = np.array(audio_data, dtype=np.float32)
        # Simple peak normalization
        peak = np.abs(audio_np).max()
        if peak > 0:
            audio_np = audio_np / peak * 0.95 # Leave 0.05 headroom
            
        return audio_np.tolist()

    def master_audio(self, raw_audio_tensor: list, duration: int) -> str:
        """
        Takes raw output from the AI model, cleans it up via DSP, and saves as WAV.
        Returns the public URL/Path to the audio file.
        """
        logger.info("Applying DSP Cleanup & Mastering...")
        
        vocoded = self.apply_vocoder(raw_audio_tensor)
        normalized = self.normalize_audio(vocoded)
        
        # Save to disk
        filename = f"omni_ai_music_{uuid.uuid4().hex[:8]}.wav"
        filepath = os.path.join(self.output_dir, filename)
        
        if sf:
            # Save actual file if dependencies exist
            audio_array = np.array(normalized, dtype=np.float32)
            sf.write(filepath, audio_array, self.sample_rate)
            logger.info(f"Audio saved to: {filepath}")
        else:
            # Fallback for dev mode without soundfile installed
            with open(filepath, "w") as f:
                f.write("SIMULATED_WAV_BINARY_DATA")
            logger.warning(f"Simulated audio saved to: {filepath} (soundfile library missing)")

        # In production, this would be served via NGINX or static mount
        return f"/api/ai-music/download/{filename}"
