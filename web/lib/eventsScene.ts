import * as THREE from "three";
import { PHOTO_FRAG, PHOTO_VERT, THUMB_FRAG, THUMB_VERT } from "@/lib/eventsShaders";
import { PropsTween, Spring, Tween, cubicBezier } from "@/lib/motion";

export type SceneItem = {
  image: string;
  focus: [number, number]; // 0..1, y measured from the top
  accent: string;
};

export type Quad = { x: number; y: number }[];

type PhotoProps = {
  rotX: number;
  rotY: number;
  rotZ: number;
  posX: number;
  posY: number;
  posZ: number;
  frameRotation: number;
  frameScale: number;
  photoScale: number;
  saturation: number;
  opacity: number;
  bend: number;
  loadingPhotoScale: number;
  homepageFramescale: number;
  homepagePhotoScale: number;
  homepageSaturation: number;
  homepageOpacity: number;
  caseFrameRotation: number;
  caseFrameScale: number;
  nextCaseSaturation: number;
  floating: number;
  light: number;
};

const FOV = 15;
const DISTANCE = 5.8;
const THUMB_Z = -10;
const PHOTO_ASPECT = 844 / 1366;

const BASE: PhotoProps = {
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  posX: 0,
  posY: 0,
  posZ: 0,
  frameRotation: 0,
  frameScale: 1,
  photoScale: 1,
  saturation: 1,
  opacity: 1,
  bend: 0,
  loadingPhotoScale: 1,
  homepageFramescale: 1,
  homepagePhotoScale: 1,
  homepageSaturation: 1,
  homepageOpacity: 1,
  caseFrameRotation: 0,
  caseFrameScale: 1,
  nextCaseSaturation: 1,
  floating: 0,
  light: 0,
};

const EASE_POSITION = cubicBezier(0.4, 0, 0.3, 1);
const EASE_FAST = cubicBezier(0.4, 0, 0.2, 1);
const EASE_PAGE = cubicBezier(0.6, 0, 0.18, 1);

type Photo = {
  group: THREE.Group;
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  corners: THREE.Vector3[];
  quad: Quad;
};

type Thumb = {
  group: THREE.Group;
  faces: THREE.Mesh[];
  mats: THREE.ShaderMaterial[];
};

function hexToRgb(hex: string): [number, number, number] {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
}

export class EventsScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  private lastMs = 0;
  private elapsed = 0;
  private raf = 0;
  private disposed = false;

  private posGroup = new THREE.Group();
  private rzGroup = new THREE.Group();
  private ryGroup = new THREE.Group();
  private rxGroup = new THREE.Group();
  private offsetGroup = new THREE.Group();
  private scrollGroup = new THREE.Group();

  private photos: Photo[] = [];
  private textures: THREE.Texture[] = [];
  private thumb!: Thumb;

  private props: PropsTween<keyof PhotoProps>;
  private scroll = new Spring(2.5, 80, 24, 0);
  private wheelOffset = 0;
  private index = 0;
  private fastNav: number | null = null;
  private flip = 0;
  private flipRotation = new Tween(0);
  private flipScale = new Tween(0);
  private thumbOpacity = new Tween(1);
  private homeProgress = new Tween(0);

  private size = { w: 1, h: 1, dpr: 1 };
  private pitch = 1;
  private photoW = 1;
  private photoH = 1;
  private restPosX = 0;
  private vpH = 1;
  private pointer: [number, number] = [-9999, -9999];
  private revealed = false;
  private loadProgress = 0;
  private totalHeight = 1;

  private presets!: { loading: PhotoProps; rest: PhotoProps; fast: PhotoProps };

  onQuads?: (quads: Quad[]) => void;
  onFrame?: (now: number) => void;
  onLoad?: (progress: number) => void;

  constructor(
    private canvas: HTMLCanvasElement,
    private items: SceneItem[],
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    THREE.ColorManagement.enabled = false;

    this.camera.position.set(0, 0, DISTANCE);

    this.posGroup.add(this.rzGroup);
    this.rzGroup.add(this.ryGroup);
    this.ryGroup.add(this.rxGroup);
    this.rxGroup.add(this.offsetGroup);
    this.offsetGroup.add(this.scrollGroup);
    this.scene.add(this.posGroup);

    this.presets = {
      loading: { ...BASE, rotX: -0.9, posX: 0.6, posZ: -0.5, loadingPhotoScale: 1.15 },
      rest: {
        ...BASE,
        rotX: -0.41,
        rotY: -0.87,
        rotZ: 0.06,
        posZ: 0.3,
        bend: 0.021,
        homepageFramescale: 0.9,
        homepagePhotoScale: 1.11,
        homepageSaturation: 0,
        homepageOpacity: 0.55,
        floating: 1,
        light: 1,
      },
      fast: {
        ...BASE,
        rotX: -0.9,
        frameScale: 0.98,
        photoScale: 1.1,
        homepageSaturation: 0,
        homepageOpacity: 0.6,
      },
    };
    this.props = new PropsTween<keyof PhotoProps>(this.presets.loading);

    this.buildThumb();
  }

  async init() {
    const loader = new THREE.TextureLoader();
    let done = 0;
    this.textures = await Promise.all(
      this.items.map(
        (it) =>
          new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(
              it.image,
              (t) => {
                t.minFilter = THREE.LinearFilter;
                t.magFilter = THREE.LinearFilter;
                t.generateMipmaps = false;
                t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
                t.colorSpace = THREE.NoColorSpace;
                done++;
                this.onLoad?.(done / this.items.length);
                resolve(t);
              },
              undefined,
              reject,
            );
          }),
      ),
    );
    if (this.disposed) return;
    this.buildPhotos();
    this.setThumbContent(0, this.index);
    this.setThumbContent(1, this.index);
    this.applyRestPosX();
    this.resize(this.size.w, this.size.h, this.size.dpr);
    this.lastMs = performance.now();
    this.loop();
  }

  /* ---------- layout ---------- */

  private viewportAt(distance: number) {
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * distance;
    return { w: h * this.camera.aspect, h };
  }

  resize(w: number, h: number, dpr: number) {
    this.size = { w, h, dpr };
    const pr = Math.min(dpr, 2);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    const v = this.viewportAt(DISTANCE);
    this.vpH = v.h;
    this.photoW = 0.46 * v.w;
    this.photoH = this.photoW * PHOTO_ASPECT;
    const margin = 0.15 * this.photoH;
    this.pitch = this.photoH + margin;
    this.totalHeight = this.pitch * this.items.length - margin;
    this.restPosX = 0.16 * v.w;

    if (this.photos.length) {
      this.photos.forEach((p, i) => {
        p.mesh.geometry.dispose();
        p.mesh.geometry = new THREE.PlaneGeometry(this.photoW, this.photoH, 50, 2);
        p.mesh.geometry.computeBoundingBox();
        p.group.position.set(0, -this.pitch * i, 0);
        const hw = this.photoW / 2;
        const hh = this.photoH / 2;
        p.corners = [
          new THREE.Vector3(-hw, hh, 0),
          new THREE.Vector3(hw, hh, 0),
          new THREE.Vector3(-hw, -hh, 0),
          new THREE.Vector3(hw, -hh, 0),
        ];
      });
      this.applyRestPosX();
    }
    this.layoutThumb();
  }

  private applyRestPosX() {
    this.presets.rest.posX = this.restPosX;
    if (this.revealed && this.fastNav === null) {
      this.props.animate(this.presets.rest, 0, (t) => t, 0, true);
    }
  }

  /* ---------- build ---------- */

  private buildPhotos() {
    this.items.forEach((it, i) => {
      const tex = this.textures[i];
      const img = tex.image as { width: number; height: number };
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: PHOTO_VERT,
        fragmentShader: PHOTO_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: [0, 0] },
          uTexture: { value: tex },
          uIsLoading: { value: true },
          uIsVisible: { value: true },
          uLoaderProgress: { value: 0 },
          uCaseProgress: { value: 0 },
          uResolution: { value: [1, 1] },
          uBounds: { value: [0, 0] },
          uAspectRatio: { value: PHOTO_ASPECT },
          uDistanceFromCenter: { value: 0 },
          uDistanceFromCenterPercentage: { value: 0 },
          uBaseColor: { value: hexToRgb("#000000") },
          uFrameRotation: { value: 0 },
          uFrameScale: { value: 1 },
          uPhotoScale: { value: 1 },
          uSaturation: { value: 1 },
          uOpacity: { value: 1 },
          uBend: { value: 0 },
          uLoadingPhotoScale: { value: 1 },
          uHomepagePhotoScale: { value: 1 },
          uHomepageSaturation: { value: 1 },
          uHomepageOpacity: { value: 1 },
          uNextCaseSaturation: { value: 1 },
          uFloating: { value: 0 },
          uLight: { value: 0 },
          uTexAspect: { value: img.width / img.height },
          uFocus: { value: [it.focus[0], 1 - it.focus[1]] },
        },
      });
      const geo = new THREE.PlaneGeometry(1, 1, 50, 2);
      geo.computeBoundingBox();
      const mesh = new THREE.Mesh(geo, mat);
      const group = new THREE.Group();
      group.add(mesh);
      this.scrollGroup.add(group);
      this.photos.push({
        group,
        mesh,
        mat,
        corners: [],
        quad: [0, 1, 2, 3].map(() => ({ x: 0, y: 0 })),
      });
    });
  }

  private buildThumb() {
    const group = new THREE.Group();
    group.position.z = THUMB_Z;
    const faces: THREE.Mesh[] = [];
    const mats: THREE.ShaderMaterial[] = [];
    for (let f = 0; f < 2; f++) {
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: THUMB_VERT,
        fragmentShader: THUMB_FRAG,
        uniforms: {
          uTexture: { value: null },
          uLoaderProgress: { value: 1 },
          uHomeProgress: { value: 0 },
          uResolution: { value: [1, 1] },
          uFace: { value: f },
          uColor: { value: [1, 1, 1] },
          uSize: { value: [1, 1] },
          uAspectRatio: { value: 157 / 267 },
          uOpacity: { value: 1 },
          uPointer: { value: [0, 0] },
          uTexAspect: { value: 1 },
          uFocus: { value: [0.5, 0.5] },
          uZoom: { value: 1.7 },
          uPan: { value: [0, 0] },
        },
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      mesh.rotation.x = Math.PI * f;
      group.add(mesh);
      faces.push(mesh);
      mats.push(mat);
    }
    this.scene.add(group);
    this.thumb = { group, faces, mats };
  }

  private layoutThumb() {
    const v = this.viewportAt(DISTANCE - THUMB_Z);
    const factor = this.size.w / v.w;
    const tw = 0.166875 * v.w;
    const th = (tw * 157) / 267;
    this.thumb.group.position.set(
      -0.5 * v.w + 0.5 * tw + 0.0382 * v.w,
      -0.5 * v.h + 0.5 * th + 40 / factor,
      THUMB_Z,
    );
    this.thumb.faces.forEach((m) => {
      m.geometry.dispose();
      m.geometry = new THREE.PlaneGeometry(tw, th, 1, 1);
    });
    this.thumb.mats.forEach((m) => {
      m.uniforms.uSize.value = [tw, th];
    });
    this.thumbBaseX = this.thumb.group.position.x;
    this.thumbW = v.w;
  }
  private thumbBaseX = 0;
  private thumbW = 1;

  private setThumbContent(face: number, itemIndex: number) {
    const tex = this.textures[itemIndex];
    if (!tex) return;
    const img = tex.image as { width: number; height: number };
    const u = this.thumb.mats[face].uniforms;
    u.uTexture.value = tex;
    u.uTexAspect.value = img.width / img.height;
    u.uFocus.value = [this.items[itemIndex].focus[0], 1 - this.items[itemIndex].focus[1]];
    u.uColor.value = hexToRgb(this.items[itemIndex].accent);
  }

  /* ---------- public state ---------- */

  setPointer(x: number, y: number) {
    this.pointer = [x * this.size.dpr, y * this.size.dpr];
  }

  setWheelOffset(v: number) {
    this.wheelOffset = v;
  }

  getPitch() {
    return this.pitch;
  }

  setIndex(i: number, immediate = false) {
    const prev = this.index;
    this.index = i;
    if (i === prev) return;
    const dir = Math.sign(i - prev);
    const now = performance.now();
    this.flip += dir;
    const s = Math.abs(this.flip) % 2;
    this.setThumbContent(s === 0 ? 0 : 1, i);
    if (immediate || this.fastNav !== null) {
      this.flipRotation.set(Math.PI * this.flip);
      this.flipScale.set(s);
    } else {
      this.flipRotation.start(Math.PI * this.flip, 1100, EASE_PAGE, now);
      this.flipScale.start(s, 1100, EASE_PAGE, now);
    }
  }

  setFastNav(i: number | null) {
    const prev = this.fastNav;
    this.fastNav = i;
    const now = performance.now();
    if ((prev === null) !== (i === null)) {
      this.props.animate(i === null ? this.presets.rest : this.presets.fast, 400, EASE_FAST, now);
      this.thumbOpacity.start(i === null ? 1 : 0, i === null ? 200 : 200, EASE_FAST, now, i === null ? 100 : 0);
    }
  }

  /** Called once the loader is gone: photos tilt into place and the thumbnail wipes in. */
  reveal() {
    const now = performance.now();
    this.revealed = true;
    this.photos.forEach((p) => (p.mat.uniforms.uIsLoading.value = false));
    this.props.animate(this.presets.rest, 820, EASE_POSITION, now);
    this.homeProgress.start(1, 1000, EASE_PAGE, now);
  }

  setLoadingProgress(p: number) {
    this.loadProgress = p;
    this.photos.forEach((ph) => (ph.mat.uniforms.uLoaderProgress.value = p));
  }

  /* ---------- loop ---------- */

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min((now - this.lastMs) / 1000, 0.05);
    this.lastMs = now;
    this.elapsed += dt;
    const time = this.elapsed;
    this.update(now, dt, time);
    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(now);
  };

  private update(now: number, dt: number, time: number) {
    // photo stack props
    this.props.update(now);
    const p = this.props.cur;
    this.posGroup.position.set(p.posX, p.posY, p.posZ);
    this.rzGroup.rotation.z = p.rotZ;
    this.ryGroup.rotation.y = p.rotY;
    this.rxGroup.rotation.x = p.rotX;

    // scroll spring
    const n = this.items.length;
    const idx = this.fastNav ?? this.index;
    const offset = this.fastNav === null ? this.wheelOffset : 0;
    const min = -0.3;
    const max = this.pitch * (n - 1) + 0.3;
    this.scroll.target = Math.min(Math.max(idx * this.pitch + offset, min), max);
    this.scrollGroup.position.y = this.scroll.step(dt);

    // stack rises from below while loading (same curve as the reference)
    const rise = this.loadProgress <= 0.2 ? 0 : (this.loadProgress - 0.2) / 0.8;
    this.offsetGroup.position.y = (this.totalHeight + this.vpH) * (1 - rise);

    this.scene.updateMatrixWorld(true);

    const res: [number, number] = [this.renderer.domElement.width, this.renderer.domElement.height];
    const quads: Quad[] = [];
    const box = new THREE.Box3();
    const tmp = new THREE.Vector3();
    const bend = p.bend;
    const M = 0.0028 * p.floating;
    const W = -0.032 * Math.sin(0.35 * time * Math.PI) * p.floating;
    const offX = [0.4 * -bend + M, 0, 0.1 * bend + M, 0];
    const offY = [1.1 * -bend - W, bend, 1.1 * -bend - W, bend];

    this.photos.forEach((ph) => {
      const u = ph.mat.uniforms;
      const bb = ph.mesh.geometry.boundingBox;
      if (!bb) return;
      box.copy(bb).applyMatrix4(ph.mesh.matrixWorld);
      const l = box.max.y + box.min.y - 2 * p.posY;
      const pct = l / this.vpH;
      const posY = 0.6 * (p.homepageFramescale - 1) * l;
      let fs = p.frameScale;
      fs *= 1 + (p.homepageFramescale - 1) * Math.abs(l);
      fs *= 1 + (p.caseFrameScale - 1) * l;
      const fr = p.frameRotation + p.caseFrameRotation * l;

      ph.mesh.position.y = posY;
      ph.mesh.scale.set(fs, fs, fs);
      ph.mesh.rotation.z = fr;

      u.uTime.value = time;
      u.uPointer.value = this.pointer;
      u.uResolution.value = res;
      u.uBounds.value = [box.max.y / this.vpH + 0.5, box.min.y / this.vpH + 0.5];
      u.uDistanceFromCenter.value = l;
      u.uDistanceFromCenterPercentage.value = pct;
      u.uFrameScale.value = fs;
      u.uFrameRotation.value = fr;
      u.uPhotoScale.value = p.photoScale;
      u.uSaturation.value = p.saturation;
      u.uOpacity.value = p.opacity;
      u.uBend.value = p.bend;
      u.uLoadingPhotoScale.value = p.loadingPhotoScale;
      u.uHomepagePhotoScale.value = p.homepagePhotoScale;
      u.uHomepageSaturation.value = p.homepageSaturation;
      u.uHomepageOpacity.value = p.homepageOpacity;
      u.uNextCaseSaturation.value = p.nextCaseSaturation;
      u.uFloating.value = p.floating;
      u.uLight.value = p.light;

      // projected corners for the title clip-path
      const q = ph.quad;
      for (let c = 0; c < 4; c++) {
        tmp
          .copy(ph.corners[c] ?? new THREE.Vector3())
          .applyMatrix4(ph.mesh.matrixWorld)
          .applyMatrix4(this.camera.matrixWorldInverse)
          .applyMatrix4(this.camera.projectionMatrix);
        q[c].x = 0.5 * (tmp.x + offX[c] + 1) * 100;
        q[c].y = 100 * (1 - 0.5 * (tmp.y + offY[c] + 1));
      }
      quads.push(q);
    });
    this.onQuads?.(quads);

    // thumbnail flip card
    const rot = this.flipRotation.update(now);
    const sc = this.flipScale.update(now);
    const s = sc <= 0 ? 1 : sc >= 1 ? 1 : sc < 0.3 ? 1 - (sc / 0.3) * 0.22 : sc <= 0.7 ? 0.78 : 0.78 + ((sc - 0.7) / 0.3) * 0.22;
    this.thumb.group.rotation.x = rot;
    this.thumb.group.scale.setScalar(s);
    const home = this.homeProgress.update(now);
    const op = this.thumbOpacity.update(now);
    this.thumb.group.position.x = this.thumbBaseX + 0.05 * -this.thumbW * (1 - home);
    this.thumb.mats.forEach((m, f) => {
      const u = m.uniforms;
      u.uHomeProgress.value = home;
      u.uLoaderProgress.value = this.revealed ? 0 : 1;
      u.uOpacity.value = op * home;
      u.uResolution.value = res;
      u.uPointer.value = this.pointer;
      u.uPan.value = [Math.sin(time * 0.35 + f) * 0.05, Math.cos(time * 0.27 + f) * 0.03];
    });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.photos.forEach((p) => {
      p.mesh.geometry.dispose();
      p.mat.dispose();
    });
    this.thumb.faces.forEach((m) => m.geometry.dispose());
    this.thumb.mats.forEach((m) => m.dispose());
    this.textures.forEach((t) => t.dispose());
    this.renderer.dispose();
  }
}
