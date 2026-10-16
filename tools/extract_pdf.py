"""Extract every embedded image from the WC catalog PDF into public/images/catalog,
named by page (p03-1.jpg ...), plus full-page renders into public/images/pages."""
import sys, json, pathlib
import pymupdf

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])
(out / "catalog").mkdir(parents=True, exist_ok=True)
(out / "pages").mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(src)
manifest = []
for pno, page in enumerate(doc, start=1):
    # order images by position on the page (top-to-bottom, left-to-right)
    infos = []
    for img in page.get_images(full=True):
        xref = img[0]
        rects = page.get_image_rects(xref)
        r = rects[0] if rects else pymupdf.Rect(0, 0, 0, 0)
        infos.append((round(r.y0 / 40), r.x0, xref, r))
    infos.sort()
    for n, (_, _, xref, r) in enumerate(infos, start=1):
        pix = pymupdf.Pixmap(doc, xref)
        if pix.alpha or pix.n > 3:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        name = f"p{pno:02d}-{n}.jpg"
        pix.save(out / "catalog" / name, jpg_quality=92)
        manifest.append({"page": pno, "file": name, "w": pix.width, "h": pix.height,
                         "rect": [round(v) for v in (r.x0, r.y0, r.x1, r.y1)]})
    page.get_pixmap(dpi=110).save(out / "pages" / f"page-{pno:02d}.jpg", jpg_quality=85)

(out / "catalog" / "manifest.json").write_text(json.dumps(manifest, indent=1))
print(len(manifest), "images extracted")
