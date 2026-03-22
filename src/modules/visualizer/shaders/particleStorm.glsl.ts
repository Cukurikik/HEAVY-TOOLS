// ============================================================
// particleStorm.glsl.ts — GLSL Shader for GPU Particle System
// Written as TypeScript string templates, compiled at WebGL runtime
// ============================================================

import type { ShaderSource } from '@/modules/visualizer/types/visualizer.types'

/**
 * Vertex shader: Positions each particle as a point sprite.
 * Receives per-instance attributes: position, velocity, size.
 * Uniforms: beat impact, time, resolution for physics.
 */
const vertex = /* glsl */ `
  precision mediump float;

  attribute vec2 a_position;    // Particle center XY (canvas coords)
  attribute vec2 a_velocity;    // Particle velocity XY
  attribute float a_size;       // Base particle size

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_beatImpact;   // 0..1 transient impact
  uniform float u_bassEnergy;   // 0..1 continuous bass level
  uniform float u_speedMultiplier;

  varying float v_energy;
  varying float v_size;

  void main() {
    // Physics: orbit + drift + beat explosion
    float orbitAngle = u_time * 0.002 * u_speedMultiplier;
    float cosA = cos(orbitAngle);
    float sinA = sin(orbitAngle);

    // Apply orbital rotation
    vec2 pos = vec2(
      a_position.x * cosA - a_position.y * sinA,
      a_position.x * sinA + a_position.y * cosA
    );

    // Beat explosion: push outward from center
    float dist = length(pos);
    vec2 dir = dist > 0.001 ? normalize(pos) : vec2(0.0, 1.0);
    pos += dir * u_beatImpact * 30.0;

    // Drift with velocity + audio energy amplification
    pos += a_velocity * (1.0 + u_bassEnergy * 2.0) * u_speedMultiplier;

    // Convert to clip space
    gl_Position = vec4(
      pos.x / (u_resolution.x * 0.5),
      pos.y / (u_resolution.y * 0.5),
      0.0,
      1.0
    );

    // Point size grows with energy
    v_size = a_size * (1.0 + u_bassEnergy * 1.5);
    gl_PointSize = v_size * (1.0 + u_beatImpact * 2.0);

    v_energy = u_bassEnergy;
  }
`

/**
 * Fragment shader: Renders soft circular particles.
 * Glow effect intensifies with beat impact.
 */
const fragment = /* glsl */ `
  precision mediump float;

  uniform vec3 u_color;
  uniform float u_beatImpact;
  uniform float u_opacity;

  varying float v_energy;
  varying float v_size;

  void main() {
    // Circular soft particle (point sprite UV)
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);

    // Smooth circle falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    // Color with energy-reactive brightness
    vec3 color = u_color * (0.5 + v_energy * 0.5);

    // Beat flash: additive glow
    color += vec3(u_beatImpact * 0.2);

    // Core glow (brighter center)
    float coreGlow = 1.0 - smoothstep(0.0, 0.2, dist);
    color += u_color * coreGlow * 0.3;

    gl_FragColor = vec4(color, alpha * u_opacity);
  }
`

export const particleStormShader: ShaderSource = { vertex, fragment }
export default particleStormShader
