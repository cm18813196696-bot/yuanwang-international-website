"""Package the pool renders for the website (Pillow and NumPy).

python tools/package-steel-renders.py /absolute/render-output assets/collections/steel-studio
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

source, destination = map(Path, sys.argv[1:])
destination.mkdir(parents=True, exist_ok=True)
for name in ['full', 'rim', 'seat', 'jet', 'drain']:
    path = source / (name + '.png')
    if not path.exists():
        continue
    pixels = np.asarray(Image.open(path).convert('RGB'), dtype=np.float32) / 255
    padded = np.pad(pixels, ((2, 2), (2, 2), (0, 0)), mode='edge')
    total = np.zeros_like(pixels)
    weights = np.zeros(pixels.shape[:2], dtype=np.float32)
    height, width = pixels.shape[:2]
    # Suppress Monte Carlo grain while preserving model edges and small fittings.
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            neighbour = padded[dy + 2:dy + 2 + height, dx + 2:dx + 2 + width]
            distance = np.sum((neighbour - pixels) ** 2, axis=2)
            weight = np.exp(-distance / (2 * .06 ** 2) - (dx * dx + dy * dy) / (2 * 1.2 ** 2))
            total += neighbour * weight[..., None]
            weights += weight
    image = Image.fromarray(np.uint8(np.clip(total / weights[..., None] * 255, 0, 255)))
    image.save(destination / (name + '.webp'), quality=92, method=6)
    print('Packaged', name, flush=True)
