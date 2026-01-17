podman run -it --rm --network host -p 127.0.0.1:8080:8080 -v $(pwd):/src -v $(pwd)/.hugo_cache:/tmp/hugo_cache docker.io/hugomods/hugo:exts server \
    --disableFastRender \
    --buildDrafts \
    -p 8080
