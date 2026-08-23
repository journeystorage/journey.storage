#!/usr/bin/env python3
"""Local dev server for the accounting intake page.

python3 -m http.server sends Last-Modified and lets Chrome cache config.js,
which means edits to the Web App URL silently don't take effect. This serves
the same files with caching turned off so a plain reload always gets the
current file.

    python3 serve.py          # http://localhost:8910
    python3 serve.py 9000     # pick another port
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_header(self, keyword, value):
        # Drop Last-Modified so Chrome can't revalidate into a 304.
        if keyword.lower() == "last-modified":
            return
        super().send_header(keyword, value)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8910
    root = Path(__file__).resolve().parent
    handler = partial(NoCacheHandler, directory=str(root))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print("serving %s" % root)
    print("http://localhost:%d/index.html" % port)
    print("ctrl-c to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
