// ============================================================
// barSpectrum.glsl.ts — GLSL Shader for Bar/Radial Spectrum
// Written as TypeScript string templates, compiled at WebGL runtime
// ============================================================

import type { ShaderSource } from '@/modules/visualizer/types/visualizer.types'

/**
 * Vertex shader: Positions each bar as a quad.
 * Receives per-instance attributes: barIndex, barHeight, barWidth.
 * Uniform: u_resolution, u_barCount, u_radius (for radial mode).
 */
const vertex = /* glsl */ `
  precision mediump float;

  attribute vec2 a_position;       // Quad corner (-0.5..0.5)
  attribute float a_barIndex;      // Which bar (0..barCount-1)
  attribute float a_barHeight;     // Normalized amplitude (0..1)

  uniform vec2 u_resolution;
  uniform float u_barCount;
  uniform float u_barWidth;
  uniform float u_radius;          // 0 = linear mode, >0 = radial mode
  uniform float u_maxHeight;
  uniform float u_time;
  uniform float u_rotationSpeed;

  varying float v_amplitude;
  varying float v_barProgress;     // 0..1 across bar index for gradient

  void main() {
    v_amplitude = a_barHeight;
    v_barProgress = a_barIndex / u_barCount;

    float h = a_barHeight * u_maxHeight;

    if (u_radius > 0.0) {
      // ---- RADIAL MODE ----
      float angle = (a_barIndex / u_barCount) * 6.28318530718; // 2*PI
      angle += u_time * u_rotationSpeed;

      // Bar extends outward from radius
      float innerR = u_radius;
      float outerR = u_radius + h;

      float r = mix(innerR, outerR, a_position.y + 0.5);
      float halfWidth = (u_barWidth / u_resolution.x) * 0.5;
      float theta = angle + (a_position.x * halfWidth * 6.28318530718);

      float x = cos(theta) * r;
      float y = sin(theta) * r;

      gl_Position = vec4(
        x / (u_resolution.x * 0.5),
        y / (u_resolution.y * 0.5),
        0.0,
        1.0
      );
    } else {
      // ---- LINEAR MODE ----
      float totalWidth = u_barCount * u_barWidth;
      float startX = -totalWidth * 0.5;

      float x = startX + a_barIndex * u_barWidth + (a_position.x + 0.5) * u_barWidth * 0.8;
      float y = (a_position.y + 0.5) * h - h * 0.5;

      gl_Position = vec4(
        x / (u_resolution.x * 0.5),
        y / (u_resolution.y * 0.5),
        0.0,
        1.0
      );
    }
  }
`

/**
 * Fragment shader: Colors each bar based on amplitude.
 * Supports uniform base color + glow intensity from beat impact.
 */
const fragment = /* glsl */ `
  precision mediump float;

  uniform vec3 u_color;
  uniform float u_glowIntensity;   // 0..1 beat impact
  uniform float u_time;

  varying float v_amplitude;
  varying float v_barProgress;

  void main() {
    // Base color with amplitude-driven brightness
    vec3 color = u_color * (0.4 + v_amplitude * 0.6);

    // Beat glow: additive white flash proportional to impact
    color += vec3(u_glowIntensity * v_amplitude * 0.3);

    // Subtle gradient across frequency range (low=warm, high=cool)
    color.r += (1.0 - v_barProgress) * 0.1;
    color.b += v_barProgress * 0.15;

    // Soft edge fade at bar tips
    float edgeFade = smoothstep(0.0, 0.05, v_amplitude);

    gl_FragColor = vec4(color, edgeFade);
  }
`

export const barSpectrumShader: ShaderSource = { vertex, fragment }
export default barSpectrumShader
