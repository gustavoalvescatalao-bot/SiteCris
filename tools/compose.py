"""Build editorial montages for the site from the original catalog photos and
background-removed cutouts. Pieces are only placed, scaled and shadowed — never altered."""
import pathlib
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageFont

ROOT = pathlib.Path("public/images")
CAT, CUT, GEN = ROOT / "catalog", ROOT / "cutouts", ROOT / "generated"
GEN.mkdir(exist_ok=True)


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def backdrop(size, top, bottom, glow=None):
    """Vertical gradient with a soft radial glow and fine grain — a seamless studio sweep."""
    w, h = size
    a, b = hexrgb(top), hexrgb(bottom)
    grad = Image.new("RGB", (1, 256))
    for y in range(256):
        t = y / 255
        grad.putpixel((0, y), tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    im = grad.resize((w, h), Image.BICUBIC)
    if glow:
        g = Image.new("L", (w, h), 0)
        ImageDraw.Draw(g).ellipse((w * .15, h * .05, w * .85, h * .85), fill=110)
        g = g.filter(ImageFilter.GaussianBlur(w / 6))
        im = Image.composite(Image.new("RGB", (w, h), hexrgb(glow)), im, g)
    noise = Image.effect_noise((w, h), 18).convert("L")
    return Image.blend(im, Image.merge("RGB", (noise,) * 3), 0.035)


def cutout(name, height):
    im = Image.open(CUT / f"{name}.png").convert("RGBA")
    return im.resize((int(im.width * height / im.height), height), Image.LANCZOS)


def place(canvas, piece, x, y, shadow=0.45, angle=0):
    if angle:
        piece = piece.rotate(angle, resample=Image.BICUBIC, expand=True)
    alpha = piece.split()[3]
    sh = Image.new("RGBA", piece.size, (20, 12, 8, 0))
    sh.putalpha(alpha.point(lambda v: int(v * shadow)))
    pad = 80
    shl = Image.new("RGBA", (piece.width + pad * 2, piece.height + pad * 2), (0, 0, 0, 0))
    shl.paste(sh, (pad, pad), sh)
    shl = shl.filter(ImageFilter.GaussianBlur(28))
    canvas.alpha_composite(shl, (max(0, x - pad + 18), max(0, y - pad + 34)))
    canvas.alpha_composite(piece, (x, y))


def photo(name, size):
    return ImageOps.fit(Image.open(CAT / f"{name}.jpg").convert("RGB"), size, Image.LANCZOS)


def framed(canvas, name, box, border=0, border_color="#F4EFE6"):
    x, y, w, h = box
    s = Image.new("RGBA", (w + 160, h + 160), (0, 0, 0, 0))
    ImageDraw.Draw(s).rectangle((80, 80, 80 + w, 80 + h), fill=(15, 10, 8, 110))
    canvas.alpha_composite(s.filter(ImageFilter.GaussianBlur(30)), (x - 80 + 14, y - 80 + 26))
    if border:
        ImageDraw.Draw(canvas).rectangle((x - border, y - border, x + w + border, y + h + border), fill=border_color)
    canvas.paste(photo(name, (w, h)), (x, y))


def save(im, name, q=86):
    im.convert("RGB").save(GEN / name, quality=q, optimize=True, progressive=True)
    print("saved", name, im.size)


# 1 · Hero group shot: the signature fiber family on a travertine sweep
W, H = 2600, 1500
c = backdrop((W, H), "#EFE7DB", "#CDBBA5", glow="#FBF7F0").convert("RGBA")
for n, hgt, cx in [("p05-1", 1000, 380), ("p07-1", 1150, 830), ("p11-1", 1250, 1300),
                   ("p04-1", 980, 1790), ("p10-1", 800, 2270)]:
    p = cutout(n, hgt)
    place(c, p, cx - p.width // 2, H - hgt - 70)
save(c, "hero-family.jpg")

# 1b · Portrait hero for phones
W, H = 1200, 1900
c = backdrop((W, H), "#EFE7DB", "#CDBBA5", glow="#FBF7F0").convert("RGBA")
for n, hgt, cx in [("p05-1", 1250, 230), ("p11-1", 1560, 600), ("p07-1", 1350, 960)]:
    p = cutout(n, hgt)
    place(c, p, cx - p.width // 2, H - hgt - 60)
save(c, "hero-family-mobile.jpg")

# 2 · Category covers
c = backdrop((1600, 2000), "#9A5538", "#6E3624", glow="#B8714F").convert("RGBA")
place(c, cutout("p10-1", 1000), 60, 140, shadow=.55)
place(c, cutout("p07-1", 1480), 820, 400, shadow=.55, angle=-4)
save(c, "cover-fiber.jpg")


def cover_collage(name, top, bot, layout, border=14):
    c = backdrop((1600, 2000), top, bot).convert("RGBA")
    for n, box in layout:
        framed(c, n, box, border=border)
    save(c, name)


cover_collage("cover-wood.jpg", "#7C8C7F", "#56645A", [
    ("p18-1", (120, 160, 640, 1080)), ("p18-2", (840, 340, 640, 900)),
    ("p20-1", (180, 1330, 520, 560)), ("p19-3", (860, 1330, 560, 560))])
cover_collage("cover-totem.jpg", "#36415A", "#1F2634", [
    ("p22-1", (110, 140, 440, 800)), ("p23-1", (580, 260, 440, 800)), ("p22-4", (1050, 140, 440, 800)),
    ("p22-2", (110, 1080, 440, 800)), ("p23-2", (580, 1180, 440, 700)), ("p23-4", (1050, 1080, 440, 800))])
cover_collage("cover-acrylic.jpg", "#2A2826", "#121110", [
    ("p24-2", (120, 140, 640, 1000)), ("p25-2", (840, 300, 640, 1000)),
    ("p24-4", (240, 1240, 520, 640)), ("p25-4", (840, 1400, 520, 480))])

# 3 · Colour stories: one tone, three pieces
stories = {
    "terracotta": ("#8C4A32", ["p07-1", "p10-1", "p14-1"]),
    "sage": ("#6B7B6E", ["p04-1", "p12-1", "p19-3"]),
    "indigo": ("#2C3545", ["p11-1", "p20-3", "p25-4"]),
    "onyx": ("#1C1B1A", ["p05-1", "p20-2", "p23-4"]),
    "sand": ("#DFD3C3", ["p13-1", "p15-1", "p01-1"]),
}
for key, (tone, (a, b, d)) in stories.items():
    light = "#%02x%02x%02x" % tuple(min(255, v + 26) for v in hexrgb(tone))
    c = backdrop((2000, 1300), light, tone).convert("RGBA")
    edge = "#FFFFFF" if key == "sand" else "#F4EFE6"
    framed(c, a, (110, 110, 700, 1080), border=12, border_color=edge)
    framed(c, b, (900, 230, 480, 640), border=12, border_color=edge)
    framed(c, d, (1460, 470, 430, 720), border=12, border_color=edge)
    save(c, f"story-{key}.jpg")

# 4 · Macro details of stones & textures
crops = [("p08-2", (0.1, 0.35, 0.9, 0.85)), ("p11-1", (0.2, 0.5, 0.8, 0.85)), ("p04-1", (0.05, 0.55, 0.55, 0.95)),
         ("p16-1", (0.2, 0.3, 0.8, 0.6)), ("p03-1", (0.35, 0.2, 0.85, 0.45)), ("p24-2", (0.1, 0.25, 0.9, 0.8)),
         ("p05-1", (0.25, 0.65, 0.95, 0.95)), ("p18-4", (0.1, 0.3, 0.9, 0.7))]
for i, (n, (l, t, r, b)) in enumerate(crops, 1):
    im = Image.open(CAT / f"{n}.jpg").convert("RGB")
    W0, H0 = im.size
    box = im.crop((int(l * W0), int(t * H0), int(r * W0), int(b * H0)))
    save(ImageOps.fit(box, (900, 1100), Image.LANCZOS), f"detail-{i}.jpg", q=84)

# 5 · Open Graph card
c = backdrop((1200, 630), "#EFE7DB", "#D3C3AE", glow="#FBF7F0").convert("RGBA")
for n, hgt, cx in [("p05-1", 520, 820), ("p11-1", 590, 960), ("p07-1", 540, 1100)]:
    p = cutout(n, hgt)
    place(c, p, cx - p.width // 2, 630 - hgt - 20, shadow=.35)
d = ImageDraw.Draw(c)
serif = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 120)
small = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 26)
d.text((76, 140), "W C   K N O T S   &   C R A F T S", font=small, fill="#5A4A42")
d.text((70, 170), "DECOR", font=serif, fill="#1C1B1A")
d.text((76, 330), "Where Brazilian artistry meets", font=small, fill="#5A4A42")
d.text((76, 366), "luxury organic decor.", font=small, fill="#5A4A42")
d.text((76, 540), "2 0 2 6   C O L L E C T I O N", font=small, fill="#8C4A32")
save(c, "og-image.jpg")

# 6 · Web-friendly cutouts (webp with alpha)
for p in CUT.glob("*.png"):
    im = Image.open(p)
    im.thumbnail((1000, 1600))
    im.save(p.with_suffix(".webp"), quality=86, method=6)
print("done")
