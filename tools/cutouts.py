"""Remove photo backgrounds from selected catalog shots (piece itself untouched)."""
import sys, pathlib
from PIL import Image
from rembg import remove, new_session

src = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2]); names = sys.argv[3:]
session = new_session("isnet-general-use")
for n in names:
    im = Image.open(src / f"{n}.jpg").convert("RGB")
    cut = remove(im, session=session, post_process_mask=True)
    cut = cut.crop(cut.getbbox())
    cut.save(out / f"{n}.png", optimize=True)
    print(n, cut.size)
