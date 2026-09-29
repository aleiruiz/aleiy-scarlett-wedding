from pathlib import Path
from PIL import Image, ImageDraw

source = Path("public/resources/Bluey/images-transparent.png")
output = Path("public/resources/Bluey/images-clean.png")
image = Image.open(source).convert("RGBA")
ImageDraw.Draw(image).ellipse((186, 268, 244, 286), fill=(0, 0, 0, 0))

# Remove only the white teeth stroke in Bluey's smile, keeping the eyes and belly intact.
pixels = image.load()
for y in range(176, 193):
    for x in range(74, 102):
        r, g, b, a = pixels[x, y]
        if a and r > 220 and g > 220 and b > 220:
            pixels[x, y] = (241, 194, 72, a)

image.save(output, optimize=True)
