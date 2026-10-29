import re,glob,os,time
from playwright.sync_api import sync_playwright
D="/Users/rehana/Desktop/project/furniflex/plagiarism_chunks"
OUT=os.path.join(D,"results"); os.makedirs(OUT,exist_ok=True)
pat=re.compile(r'(\d{1,3}(?:\.\d+)?)\s*%\s*(Plagiarism|Unique|Exact Match|Partial Match)',re.I)
with sync_playwright() as p:
    b=p.chromium.launch(headless=False)
    ctx=b.new_context(viewport={"width":1300,"height":950})
    for f in sorted(glob.glob(f"{D}/part_*.txt")):
        name=os.path.basename(f)[:-4]
        pg=ctx.new_page()
        pg.goto("https://smallseotools.com/plagiarism-checker/",wait_until="domcontentloaded",timeout=90000)
        pg.wait_for_selector("#textbox",timeout=60000)
        pg.fill("#textbox",open(f).read())
        pg.locator("#check_validation").scroll_into_view_if_needed()
        print(f"\n>>> {name}: tick 'Verify you are human' in the window, then click Check Plagiarism.",flush=True)
        t0=time.time(); hits=None
        while time.time()-t0<600:
            pg.wait_for_timeout(3000)
            hits=pat.findall(pg.inner_text("body"))
            if any(h[1].lower()=="unique" for h in hits): pg.wait_for_timeout(4000); break
        body=pg.inner_text("body")
        open(f"{OUT}/{name}.txt","w").write(body)
        pg.screenshot(path=f"{OUT}/{name}.png",full_page=True)
        res={h[1].title():h[0] for h in pat.findall(body)}
        print(f"<<< {name}: {res or 'no result within 10 min'}",flush=True)
        open(f"{OUT}/summary.txt","a").write(f"{name}\t{res}\n")
        pg.close()
    b.close()
print("\nDone. Results saved in",OUT)
