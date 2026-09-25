/* Shaders ported from the reference site, with a "cover" UV mapping added so any
   photo aspect ratio fills the 16:10 frames. */

export const PHOTO_VERT = /* glsl */ `
uniform float uTime;
uniform float uAspectRatio;
uniform float uFrameRotation;
uniform float uFrameScale;
uniform float uBend;
uniform float uFloating;

varying vec2 vUv;

const float PI = 3.141592653589793;

mat2 scale(vec2 value){
  return mat2(value.x, 0.0, 0.0, value.y);
}

vec2 scaleUv(vec2 uv, float scaleFactor){
  float parsedScaleFactor = 1.0 - (scaleFactor - 1.0);
  return uv * scale(vec2(parsedScaleFactor)) + vec2((1.0 - parsedScaleFactor) * 0.5);
}

mat2 rotate(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

vec2 rotateUv(vec2 uv, float angle){
  uv -= 0.5;
  uv.y *= uAspectRatio;
  uv *= rotate(angle);
  uv.y /= uAspectRatio;
  uv += 0.5;
  return uv;
}

void main() {
  vec3 pos = position;

  vUv = uv;

  // bend
  pos.y -= uBend * (1.0 - sin(uv.x * PI));
  pos.x += uBend * (uv.y * 2.0 - 1.0) * (uv.x * 2.0 - 1.0) * 0.5;

  // scaling
  vUv = scaleUv(vUv, 1.0 + (1.0 - uFrameScale));

  // rotation
  vUv = rotateUv(vUv, uFrameRotation);

  // floating
  float reducedTime = uTime * 0.35;
  float floatingWave = sin(reducedTime * PI) * uFloating;

  float yShift = 0.028;
  float xShift = -0.007;

  pos.y += floatingWave * yShift;
  pos.x += floatingWave * xShift;
  vUv.y += floatingWave * yShift;
  vUv.x += floatingWave * xShift;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const PHOTO_FRAG = /* glsl */ `
uniform vec2 uPointer;
uniform sampler2D uTexture;
uniform bool uIsLoading;
uniform bool uIsVisible;
uniform float uLoaderProgress;
uniform float uCaseProgress;
uniform vec2 uResolution;
uniform vec2 uBounds;
uniform float uAspectRatio;
uniform float uDistanceFromCenter;
uniform float uDistanceFromCenterPercentage;
uniform vec3 uBaseColor;
uniform float uFrameRotation;
uniform float uPhotoScale;
uniform float uSaturation;
uniform float uOpacity;
uniform float uLoadingPhotoScale;
uniform float uHomepagePhotoScale;
uniform float uHomepageSaturation;
uniform float uHomepageOpacity;
uniform float uNextCaseSaturation;
uniform float uLight;
uniform float uTexAspect;
uniform vec2 uFocus;

varying vec2 vUv;

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut(float t) {
  return sin(t * HALF_PI);
}

mat2 scale(vec2 value){
  return mat2(value.x, 0.0, 0.0, value.y);
}

float loaderPhotoProgress(){
  const float correctionFactor = 0.1;
  const float correctionLength = 0.15;

  float correction = correctionFactor * clamp((uLoaderProgress - 0.5) / 0.5, 0.0, 1.0);

  float totalSize = uBounds.x - uBounds.y + correctionLength;
  float progress = uLoaderProgress + correction - uBounds.y;

  return clamp(progress / totalSize, 0.0, 1.0);
}

vec2 scaleUv(vec2 uv, float scaleFactor){
  float parsedScaleFactor = 1.0 - (scaleFactor - 1.0);
  return uv * scale(vec2(parsedScaleFactor)) + vec2((1.0 - parsedScaleFactor) * 0.5);
}

mat2 rotate(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

vec2 rotateUv(vec2 uv, float angle){
  uv -= 0.5;
  uv.y *= uAspectRatio;
  uv *= rotate(angle);
  uv.y /= uAspectRatio;
  uv += 0.5;
  return uv;
}

vec4 saturation(vec4 color, float saturation){
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec4 bn = vec4(vec3(gray), 1.0);
  return mix(bn, color, saturation);
}

// object-fit: cover for the photo inside the 16:10 frame
vec2 coverUv(vec2 uv){
  float frameAspect = 1.0 / uAspectRatio;
  vec2 win = vec2(1.0);
  if (uTexAspect < frameAspect) {
    win.y = uTexAspect / frameAspect;
  } else {
    win.x = frameAspect / uTexAspect;
  }
  vec2 origin = clamp(uFocus - win * 0.5, vec2(0.0), vec2(1.0) - win);
  return origin + clamp(uv, 0.0, 1.0) * win;
}

void main(){
  vec2 st = gl_FragCoord.xy / uResolution;
  vec2 uv = vUv;

  // scaling
  float scaleFactor = uPhotoScale + 0.05;
  scaleFactor += (uLoadingPhotoScale - 1.0) * (1.0 - loaderPhotoProgress());
  scaleFactor += (uHomepagePhotoScale - 1.0) * abs(uDistanceFromCenter);
  uv = scaleUv(uv, scaleFactor);

  // texture
  vec4 color = texture2D(uTexture, coverUv(uv));

  // loader masking
  if (uIsLoading) {
    float progress = smoothstep(uLoaderProgress - 0.32, uLoaderProgress + 0.05, st.y);
    vec4 placeholder = vec4(uBaseColor, 1.0);
    color = mix(color, placeholder, progress);
  }

  // saturation / opacity depend on the distance from the centre
  float saturationValue = uSaturation;
  float opacityValue = uOpacity;

  float normalizedDistanceFromCenter = 1.0 - clamp(abs(uDistanceFromCenter), 0.0, 1.0);
  saturationValue *= uHomepageSaturation + (1.0 - uHomepageSaturation) * normalizedDistanceFromCenter;
  opacityValue *= uHomepageOpacity + (1.0 - uHomepageOpacity) * normalizedDistanceFromCenter;

  color = saturation(color, saturationValue);
  color = vec4(color.rgb, opacityValue);

  // next progress
  vec2 rotatedUv = rotateUv(uv, -uFrameRotation);

  if (smoothstep(0.0, 0.87, rotatedUv.x) > 1.0 - abs(uDistanceFromCenterPercentage * 0.7)) {
    color = saturation(color, uNextCaseSaturation);
  }

  // light following the pointer
  float width = 0.7;
  float brighteness = 0.08;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 pointer = uPointer;

  pointer.x /= uResolution.x;
  pointer.y /= uResolution.y;
  pointer.y = 1.0 - pointer.y;

  vec2 dist = pointer - st.xy;
  dist *= vec2(aspectRatio, 1.0);

  float value = sineOut(min(length(dist) / width, 1.0));
  value = (1.0 - value) * brighteness * uLight * color.a;

  vec4 light = vec4(value);

  gl_FragColor = color + light;
}
`;

export const THUMB_VERT = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const THUMB_FRAG = /* glsl */ `
uniform sampler2D uTexture;
uniform float uLoaderProgress;
uniform float uHomeProgress;
uniform vec2 uResolution;
uniform float uFace;
uniform vec3 uColor;
uniform vec2 uSize;
uniform float uAspectRatio;
uniform float uOpacity;
uniform vec2 uPointer;
uniform float uTexAspect;
uniform vec2 uFocus;
uniform float uZoom;
uniform vec2 uPan;

varying vec2 vUv;

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut(float t) {
  return sin(t * HALF_PI);
}

mat2 scale(vec2 value){
  return mat2(value.x, 0.0, 0.0, value.y);
}

vec2 scaleUv(vec2 uv, vec2 scaleFactor){
  vec2 parsedScaleFactor = 1.0 - (scaleFactor - 1.0);
  uv -= 0.5;
  uv *= scale(parsedScaleFactor);
  uv += 0.5;
  return uv;
}

float roundedCorners(vec2 size, vec2 uv) {
  vec2 center = size * 0.5;
  vec2 hsize = size * 0.5;
  vec2 pos = uv * size;
  float radius = 0.035;

  float roundedRect = length(max(abs(pos - center) - (hsize - radius), 0.0)) - radius;

  roundedRect = 1.0 - roundedRect;
  roundedRect = smoothstep(0.99, 1.0, roundedRect);

  return roundedRect;
}

// preview crop: cover + zoom + slow pan (stands in for the reference's video)
vec2 previewUv(vec2 uv){
  float frameAspect = uSize.x / uSize.y;
  vec2 win = vec2(1.0);
  if (uTexAspect < frameAspect) {
    win.y = uTexAspect / frameAspect;
  } else {
    win.x = frameAspect / uTexAspect;
  }
  win /= uZoom;
  vec2 origin = clamp(uFocus + uPan - win * 0.5, vec2(0.0), vec2(1.0) - win);
  return origin + clamp(uv, 0.0, 1.0) * win;
}

void main(){
  vec2 st = gl_FragCoord.xy / uResolution;

  vec2 uv = vUv;

  uv = scaleUv(uv, vec2(0.9607843137, 0.9333333333));

  vec4 color = texture2D(uTexture, previewUv(uv));

  vec4 border = vec4(uColor, 1.0);

  if (uv.x <= 0.0) {
    color = border;
  } else if (uv.x >= 1.0) {
    color = border;
  } else if (uv.y <= 0.0) {
    color = border;
  } else if (uv.y >= 1.0) {
    color = border;
  }

  if (st.x > 1.0 - uLoaderProgress) {
    color = vec4(0.0);
  }

  if (st.x < 1.0 - uHomeProgress) {
    color = vec4(0.0);
  }

  // light
  float width = 0.45;
  float brighteness = 0.12;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 pointer = uPointer;

  pointer.x /= uResolution.x;
  pointer.y /= uResolution.y;
  pointer.y = 1.0 - pointer.y;

  vec2 dist = pointer - st.xy;
  dist *= vec2(aspectRatio, 1.0);

  float value = sineOut(min(length(dist) / width, 1.0));
  value = (1.0 - value) * brighteness * color.a;

  vec4 light = vec4(value);

  float roundedRect = roundedCorners(uSize, vUv);

  gl_FragColor = (color + light);

  gl_FragColor.a *= roundedRect;
  gl_FragColor.a *= uOpacity;
}
`;
