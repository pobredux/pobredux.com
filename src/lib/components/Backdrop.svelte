<script lang="ts">
  import { onMount } from "svelte";

  const IMAGE = "/assets/bw-divine.png";
  const WIDE = 1080;
  const MAX_DPR = 1.5;

  const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

  const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uPx;
uniform float uCell;
uniform vec3 uMouse;
uniform vec3 uFace;
uniform float uLight;
uniform sampler2D uImg;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float face(vec2 p) {
  vec2 uv = (p - uFace.xy) / uFace.z + 0.5;
  uv += 0.006 * vec2(snoise(uv * 3.0 + uTime * 0.15), snoise(uv * 3.0 - uTime * 0.15 + 7.0));
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  vec4 c = texture2D(uImg, uv);
  float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  return mix(smoothstep(0.1, 0.85, l * c.a), c.a * smoothstep(0.2, 0.85, 1.0 - l), uLight);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = p / uRes.y;
  float t = uTime;

  vec2 w = uv * 1.1;
  w += 0.35 * vec2(
    snoise(w * 0.9 + vec2(t * 0.03, -t * 0.02)),
    snoise(w * 0.9 + vec2(-t * 0.025, t * 0.035) + 4.7)
  );
  float n1 = snoise(w * 1.3 + t * 0.02) * 0.5 + 0.5;
  float n2 = snoise(w * 0.7 - t * 0.015 + 9.1) * 0.5 + 0.5;

  vec3 cobalt = vec3(0.271, 0.486, 0.992);
  vec3 indigo = vec3(0.055, 0.075, 0.19);
  vec3 ember = vec3(0.78, 0.6, 0.33);

  float glow = smoothstep(0.3, 1.0, n1);
  float g = floor(glow * 5.0 + bayer8(p / (2.0 * uPx))) / 5.0;
  float blue = g * smoothstep(0.5, 1.0, n2);
  float warm = g * (1.0 - n2);

  vec3 dark = vec3(0.043, 0.043, 0.047);
  dark = mix(dark, indigo, g * 0.55);
  dark += cobalt * blue * 0.09 + ember * warm * 0.025;

  vec3 light = vec3(0.984, 0.98, 0.969);
  light = mix(light, vec3(0.9, 0.92, 0.97), g * 0.6);
  light = mix(light, cobalt, blue * 0.06);
  light = mix(light, vec3(0.95, 0.89, 0.78), warm * 0.3);

  vec3 col = mix(dark, light, uLight);

  vec2 c = (floor(p / uCell) + 0.5) * uCell;
  float md = length(c - uMouse.xy);
  float reach = 170.0 * uPx;
  float m = uMouse.z * exp(-md * md / (reach * reach));
  float f = face(c);
  float sweep = 0.5 + 0.5 * sin((c.x * 0.6 + c.y) / uRes.y * 5.0 - t * 0.5);

  float size = max(f * (0.8 + 0.2 * sweep), 0.14 + 0.16 * glow);
  size = min(size + m * 0.45, 1.0);
  float r = 0.45 * uCell * size;
  float dotA = 1.0 - smoothstep(r - 0.75 * uPx, r + 0.75 * uPx, length(p - c));
  float bright = (mix(0.08, 0.28, f) + 0.06 * f * sweep) * mix(1.0, 0.8, uLight) + 0.2 * m;
  vec3 ink = mix(vec3(0.66, 0.69, 0.8), vec3(0.15, 0.16, 0.21), uLight);
  vec3 dotCol = mix(ink, cobalt, 0.2 + 0.4 * m - 0.15 * f);
  col = mix(col, dotCol, dotA * bright);

  vec2 v = (p / uRes - vec2(0.5, 0.4)) * vec2(uRes.x / uRes.y, 1.0);
  col *= mix(mix(0.55, 0.96, uLight), 1.0, smoothstep(1.3, 0.2, length(v)));
  col += (hash(p + fract(t * 7.0) * 113.0) - 0.5) * mix(0.035, 0.03, uLight);

  gl_FragColor = vec4(col, 1.0);
}
`;

  let canvas: HTMLCanvasElement;
  let failed = $state(false);

  function shader(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  }

  onMount(() => {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      failed = true;
      return;
    }

    const prog = gl.createProgram()!;
    try {
      gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (e) {
      console.warn(e);
      failed = true;
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uPx = u("uPx");
    const uCell = u("uCell");
    const uMouse = u("uMouse");
    const uFace = u("uFace");
    const uLight = u("uLight");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u("uImg"), 0);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    const scheme = matchMedia("(prefers-color-scheme: light)");
    let dpr = 1;
    let width = 0;
    let height = 0;
    let visible = true;
    let raf = 0;
    let last = 0;
    let time = 0;
    const target = { x: 0, y: 0, z: 0 };
    const mouse = { x: 0, y: 0, z: 0 };

    function layout() {
      dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl!.viewport(0, 0, canvas.width, canvas.height);

      const wide = width >= WIDE;
      const cx = wide ? Math.max(0, (width - 1440) / 2) + 24 + 180 : width / 2;
      const cy = wide ? height * 0.52 : height * 0.4;
      const size = wide ? height * 0.95 : Math.min(width * 1.15, height * 0.75);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uPx, dpr);
      gl!.uniform1f(uCell, (wide ? 7 : 6) * dpr);
      gl!.uniform3f(uFace, cx * dpr, cy * dpr, size * dpr);
    }

    function draw() {
      mouse.x += (target.x - mouse.x) * 0.12;
      mouse.y += (target.y - mouse.y) * 0.12;
      mouse.z += (target.z - mouse.z) * 0.06;
      gl!.uniform1f(uTime, time);
      gl!.uniform3f(uMouse, mouse.x * dpr, mouse.y * dpr, mouse.z);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function tone() {
      const t = document.documentElement.dataset.theme;
      const light = t ? t === "light" : scheme.matches;
      gl!.uniform1f(uLight, light ? 1 : 0);
      if (width > 0 && height > 0) draw();
    }

    function tick(now: number) {
      time += Math.min(now - last, 64) / 1000;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(raf);
      raf = 0;
      if (width === 0 || height === 0) return;
      if (reduce.matches) {
        target.z = mouse.z = 0;
        draw();
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    function move(e: PointerEvent) {
      if (!fine.matches) return;
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (target.z === 0) {
        mouse.x = target.x;
        mouse.y = target.y;
      }
      target.z = 1;
    }
    const leave = () => (target.z = 0);

    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (!raf) draw();
    };
    img.src = IMAGE;

    const resize = new ResizeObserver(() => {
      layout();
      sync();
    });
    resize.observe(canvas);
    const seeing = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    seeing.observe(canvas);
    tone();
    const themed = new MutationObserver(tone);
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    scheme.addEventListener("change", tone);
    addEventListener("pobredux:theme", tone);

    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seeing.disconnect();
      themed.disconnect();
      scheme.removeEventListener("change", tone);
      removeEventListener("pobredux:theme", tone);
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      reduce.removeEventListener("change", sync);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  });
</script>

<div class="backdrop" class:failed aria-hidden="true">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .backdrop {
    position: absolute;
    inset: 0 0 auto;
    z-index: 0;
    height: max(100dvh, 720px);
    overflow: hidden;
    background: var(--bg-0);
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent);
    mask-image: linear-gradient(to bottom, #000 65%, transparent);
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  .failed {
    display: none;
  }
</style>
