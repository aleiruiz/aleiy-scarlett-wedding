from collections import deque
from pathlib import Path
from PIL import Image
import sys

def looks_like_checkerboard(pixel):
    r, g, b, _ = pixel
    return max(r, g, b) - min(r, g, b) <= 10 and 55 <= r <= 255

def clean(path):
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    queue = deque()
    visited = set()
    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or not looks_like_checkerboard(pixels[x, y]):
            continue
        visited.add((x, y))
        pixels[x, y] = (*pixels[x, y][:3], 0)
        if x: queue.append((x - 1, y))
        if x + 1 < width: queue.append((x + 1, y))
        if y: queue.append((x, y - 1))
        if y + 1 < height: queue.append((x, y + 1))
    image.save(path, optimize=True)

for filename in sys.argv[1:]:
    clean(Path(filename))
