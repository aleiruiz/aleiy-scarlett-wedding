from io import BytesIO
from pathlib import Path
import sys
import zipfile

from PIL import Image, ImageOps


SELECTION = {
    "DSC_7408.jpg": "hero.webp",
    "DSC_7682.jpg": "story.webp",
    "DSC_7421.jpg": "gallery-close.webp",
    "DSC_7435.jpg": "gallery-detail.webp",
    "DSC_7719.jpg": "gallery-walk.webp",
    "DSC_7358.jpg": "gallery-mountain.webp",
    "DSC_7587.jpg": "schedule.webp",
    "DSC_7841.jpg": "family.webp",
    "DSC_7410.jpg": "entry.webp",
}


archive_path = Path(sys.argv[1])
output_dir = Path(sys.argv[2] if len(sys.argv) > 2 else "public/photos")
output_dir.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(archive_path) as archive:
    entries = {
        Path(item.filename).name: item
        for item in archive.infolist()
        if not item.is_dir()
    }

    for source_name, output_name in SELECTION.items():
        with archive.open(entries[source_name]) as source:
            image = Image.open(BytesIO(source.read()))
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.thumbnail((1800, 2200), Image.Resampling.LANCZOS)
            image.save(
                output_dir / output_name,
                "WEBP",
                quality=84,
                method=6,
            )
        print(f"{source_name} -> {output_name}")
