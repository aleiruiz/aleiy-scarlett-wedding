from pathlib import Path
from PIL import Image, ImageDraw

source = Path("public/resources/Bluey/images-transparent.png")
output = Path("public/resources/Bluey/images-clean.png")
image = Image.open(source).convert("RGBA")
draw = ImageDraw.Draw(image)

# Remove the small gray oval shadow below Bingo without touching her feet.
draw.ellipse((186, 268, 244, 286), fill=(0, 0, 0, 0))

# Cover the stray white smile-stroke on Bluey's yellow muzzle with a close local tone.
pixels = image.load()
for y in range(137, 163):
    for x in range(72, 122):
        r, g, b, a = pixels[x, y]
        if a and r > 225 and g > 225 and b > 225:
            pixels[x, y] = (243, 195, 70, a)

image.save(output, optimize=True)
