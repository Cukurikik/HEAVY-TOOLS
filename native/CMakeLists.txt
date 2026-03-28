cmake_minimum_required(VERSION 3.15)
project(OmniToolNative LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ═══════════════════════════════════════════════════
# Omni-Tool Native C++ → WebAssembly Build System
# Compiled via Emscripten (emcmake cmake ..)
# ═══════════════════════════════════════════════════

# --- Image Processing Kernel ---
add_executable(omni-image-kernel
  src/image-kernel/image_kernel.cpp
  src/bindings/image_embind.cpp
)
target_include_directories(omni-image-kernel PRIVATE src/image-kernel)

# --- Audio DSP Engine ---
add_executable(omni-audio-dsp
  src/audio-dsp/audio_dsp.cpp
  src/bindings/audio_embind.cpp
)
target_include_directories(omni-audio-dsp PRIVATE src/audio-dsp)

# --- Crypto Engine ---
add_executable(omni-crypto-engine
  src/crypto-engine/crypto_engine.cpp
  src/bindings/crypto_embind.cpp
)
target_include_directories(omni-crypto-engine PRIVATE src/crypto-engine)

# ═══════════════════════════════════════════════════
# Emscripten Compilation Flags (applied to all targets)
# ═══════════════════════════════════════════════════
set(WASM_TARGETS omni-image-kernel omni-audio-dsp omni-crypto-engine)

foreach(target ${WASM_TARGETS})
  set_target_properties(${target} PROPERTIES
    SUFFIX ".js"                           # Generates .js glue + .wasm binary
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../public/wasm"
  )

  target_link_options(${target} PRIVATE
    # Core WASM settings
    "SHELL:-s WASM=1"
    "SHELL:-s MODULARIZE=1"                # Export as ES module factory
    "SHELL:-s EXPORT_ES6=1"                # ES6 import/export syntax
    "SHELL:-s ENVIRONMENT=web,worker"      # Target browser + Web Worker

    # Memory management
    "SHELL:-s INITIAL_MEMORY=67108864"     # 64MB initial heap
    "SHELL:-s ALLOW_MEMORY_GROWTH=1"       # Dynamic memory expansion
    "SHELL:-s MAXIMUM_MEMORY=536870912"    # 512MB max heap

    # Performance flags
    "SHELL:-s WASM_BIGINT=1"               # Native BigInt support
    "SHELL:-msimd128"                      # Enable WASM SIMD instructions
    
    # Embind (C++ ↔ JS bridge)
    "SHELL:--bind"                          # Enable Embind bindings
    
    # Optimization
    "SHELL:-O3"                             # Maximum optimization
    "SHELL:-flto"                           # Link-Time Optimization
  )
endforeach()

# ═══════════════════════════════════════════════════
# Threading Variant (optional — requires COOP/COEP headers)
# Build with: emcmake cmake .. -DENABLE_THREADS=ON
# ═══════════════════════════════════════════════════
option(ENABLE_THREADS "Enable pthread/SharedArrayBuffer threading" OFF)

if(ENABLE_THREADS)
  foreach(target ${WASM_TARGETS})
    target_link_options(${target} PRIVATE
      "SHELL:-s USE_PTHREADS=1"
      "SHELL:-s PTHREAD_POOL_SIZE=4"
      "SHELL:-s SHARED_MEMORY=1"
    )
  endforeach()
  message(STATUS "[Omni-Tool] Threading ENABLED — requires COOP/COEP headers")
else()
  message(STATUS "[Omni-Tool] Threading DISABLED — single-threaded WASM build")
endif()
