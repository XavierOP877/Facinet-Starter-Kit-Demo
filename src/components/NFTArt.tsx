'use client';

// ============================================
// Generative SVG Art for each NFT
// Each piece is unique, animated, and code-generated.
// ============================================

// Deterministic pseudo-random — same output on server & client
function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface NFTArtProps {
  id: string;
  size?: number;
}

export default function NFTArt({ id, size = 400 }: NFTArtProps) {
  switch (id) {
    case 'cosmic-nexus':
      return <CosmicNexus size={size} />;
    case 'digital-phantom':
      return <DigitalPhantom size={size} />;
    case 'quantum-bloom':
      return <QuantumBloom size={size} />;
    case 'neural-drift':
      return <NeuralDrift size={size} />;
    default:
      return null;
  }
}

/* ==============================
   1. Cosmic Nexus — Purple/Violet
   Spiraling nebula with concentric rings
   ============================== */
function CosmicNexus({ size }: { size: number }) {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    cx: Math.sin(i * 2.4) * 150 + 200 + (seeded(i * 7 + 1) - 0.5) * 80,
    cy: Math.cos(i * 2.4) * 150 + 200 + (seeded(i * 7 + 2) - 0.5) * 80,
    r: seeded(i * 7 + 3) * 1.5 + 0.3,
    opacity: seeded(i * 7 + 4) * 0.7 + 0.3,
  }));

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className="w-full h-full">
      <defs>
        <radialGradient id="cn-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
        <radialGradient id="cn-glow" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="cn-blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="400" rx="16" fill="url(#cn-bg)" />

      {/* Nebula glow */}
      <circle cx="200" cy="200" r="140" fill="url(#cn-glow)" />

      {/* Concentric rings */}
      {[160, 130, 100, 70, 45, 25].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="#8b5cf6"
          strokeOpacity={0.06 + i * 0.04}
          strokeWidth={0.5 + i * 0.2}
          strokeDasharray={i % 2 === 0 ? 'none' : '4 6'}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 200 200`}
            to={`${i % 2 === 0 ? 360 : -360} 200 200`}
            dur={`${20 + i * 5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Spiral path */}
      <path
        d="M200,200 C220,160 260,170 260,200 C260,230 230,260 200,260 C170,260 140,230 140,200 C140,170 170,140 200,140 C230,140 270,160 280,200"
        fill="none"
        stroke="#a78bfa"
        strokeOpacity="0.15"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="30s"
          repeatCount="indefinite"
        />
      </path>

      {/* Stars */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.opacity}>
          <animate
            attributeName="opacity"
            values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
            dur={`${2 + seeded(i * 7 + 5) * 3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Central bright point */}
      <circle cx="200" cy="200" r="12" fill="#8b5cf6" filter="url(#cn-blur)" opacity="0.4" />
      <circle cx="200" cy="200" r="3" fill="#fff" opacity="0.9" />
      <circle cx="200" cy="200" r="1.5" fill="#fff" />
    </svg>
  );
}

/* ==============================
   2. Digital Phantom — Cyan/Teal
   Glitch art with scan lines
   ============================== */
function DigitalPhantom({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className="w-full h-full">
      <defs>
        <linearGradient id="dp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#061820" />
          <stop offset="100%" stopColor="#050510" />
        </linearGradient>
        <filter id="dp-glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
        <clipPath id="dp-clip">
          <rect x="40" y="40" width="320" height="320" rx="8" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="400" height="400" rx="16" fill="url(#dp-bg)" />

      {/* Grid lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 20}
          x2="400"
          y2={i * 20}
          stroke="#06b6d4"
          strokeOpacity="0.03"
          strokeWidth="0.5"
        />
      ))}

      {/* Glitch rectangles — RGB channel split */}
      <g clipPath="url(#dp-clip)">
        {/* Red channel */}
        <rect x="130" y="120" width="140" height="160" rx="4" fill="none" stroke="#ef4444" strokeOpacity="0.15" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; 3,-1; -2,2; 0,0" dur="4s" repeatCount="indefinite" />
        </rect>

        {/* Cyan channel (main) */}
        <rect x="132" y="122" width="136" height="156" rx="4" fill="none" stroke="#06b6d4" strokeOpacity="0.3" strokeWidth="2" />

        {/* Blue channel */}
        <rect x="134" y="124" width="132" height="152" rx="4" fill="none" stroke="#3b82f6" strokeOpacity="0.12" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; -2,1; 3,-1; 0,0" dur="3.5s" repeatCount="indefinite" />
        </rect>

        {/* Inner eye/diamond */}
        <path
          d="M200,160 L240,200 L200,240 L160,200 Z"
          fill="none"
          stroke="#06b6d4"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        >
          <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Eye center */}
        <circle cx="200" cy="200" r="15" fill="#06b6d4" fillOpacity="0.08" stroke="#06b6d4" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="200" cy="200" r="5" fill="#06b6d4" fillOpacity="0.5">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Scan line */}
        <rect x="40" y="0" width="320" height="2" fill="#06b6d4" opacity="0.15">
          <animate attributeName="y" values="-2;400" dur="4s" repeatCount="indefinite" />
        </rect>

        {/* Glitch bars */}
        {[80, 155, 230, 290, 340].map((y, i) => (
          <rect
            key={y}
            x={60 + i * 10}
            y={y}
            width={280 - i * 20}
            height="1.5"
            fill="#06b6d4"
            opacity={0.05 + i * 0.02}
          >
            <animate
              attributeName="width"
              values={`${280 - i * 20};${200 - i * 10};${280 - i * 20}`}
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>

      {/* Binary dots */}
      {Array.from({ length: 12 }, (_, i) => (
        <text
          key={i}
          x={50 + (i % 4) * 100}
          y={350 + Math.floor(i / 4) * 15}
          fill="#06b6d4"
          fillOpacity="0.15"
          fontSize="8"
          fontFamily="monospace"
        >
          {seeded(i * 3 + 50) > 0.5 ? '01' : '10'}
        </text>
      ))}
    </svg>
  );
}

/* ==============================
   3. Quantum Bloom — Pink/Rose
   Abstract flower mandala
   ============================== */
function QuantumBloom({ size }: { size: number }) {
  const petals = 12;

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className="w-full h-full">
      <defs>
        <radialGradient id="qb-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0815" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
        <radialGradient id="qb-glow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </radialGradient>
        <filter id="qb-soft">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="400" rx="16" fill="url(#qb-bg)" />
      <circle cx="200" cy="200" r="160" fill="url(#qb-glow)" />

      {/* Outer particle ring */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 155 + Math.sin(i * 3) * 10;
        const sizeR = 1 + seeded(i * 5 + 100);
        const opBase = 0.2 + seeded(i * 5 + 101) * 0.3;
        const opAnim = 0.2 + seeded(i * 5 + 102) * 0.3;
        const durVal = 2 + seeded(i * 5 + 103) * 2;
        return (
          <circle
            key={`ring-${i}`}
            cx={200 + Math.cos(angle) * r}
            cy={200 + Math.sin(angle) * r}
            r={sizeR}
            fill="#ec4899"
            opacity={opBase}
          >
            <animate
              attributeName="opacity"
              values={`${opAnim};0.1;${opAnim}`}
              dur={`${durVal}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      {/* Petals — rotated ellipses */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="60s"
          repeatCount="indefinite"
        />
        {Array.from({ length: petals }, (_, i) => {
          const rotation = (i / petals) * 360;
          return (
            <ellipse
              key={`petal-${i}`}
              cx="200"
              cy="200"
              rx="20"
              ry="80"
              fill="none"
              stroke="#ec4899"
              strokeOpacity={0.08 + (i % 3) * 0.04}
              strokeWidth="1.5"
              transform={`rotate(${rotation} 200 200)`}
            />
          );
        })}
      </g>

      {/* Inner mandala */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 200 200"
          to="0 200 200"
          dur="40s"
          repeatCount="indefinite"
        />
        {Array.from({ length: 6 }, (_, i) => {
          const rotation = (i / 6) * 360;
          return (
            <ellipse
              key={`inner-${i}`}
              cx="200"
              cy="200"
              rx="12"
              ry="50"
              fill="#ec4899"
              fillOpacity="0.03"
              stroke="#f472b6"
              strokeOpacity="0.12"
              strokeWidth="1"
              transform={`rotate(${rotation} 200 200)`}
            />
          );
        })}
      </g>

      {/* Center */}
      <circle cx="200" cy="200" r="25" fill="#ec4899" fillOpacity="0.06" filter="url(#qb-soft)" />
      <circle cx="200" cy="200" r="12" fill="#ec4899" fillOpacity="0.1" stroke="#ec4899" strokeOpacity="0.3" strokeWidth="1">
        <animate attributeName="r" values="12;15;12" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="200" r="4" fill="#fff" fillOpacity="0.7">
        <animate attributeName="fillOpacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Geometric overlay — hexagon */}
      <polygon
        points="200,140 252,170 252,230 200,260 148,230 148,170"
        fill="none"
        stroke="#ec4899"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      <polygon
        points="200,160 236,180 236,220 200,240 164,220 164,180"
        fill="none"
        stroke="#ec4899"
        strokeOpacity="0.1"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/* ==============================
   4. Neural Drift — Emerald/Green
   Neural network visualization
   ============================== */
function NeuralDrift({ size }: { size: number }) {
  // Generate deterministic nodes
  const nodes = [
    { x: 200, y: 200, r: 8, main: true },
    { x: 120, y: 120, r: 4, main: false },
    { x: 280, y: 100, r: 5, main: false },
    { x: 300, y: 220, r: 4, main: false },
    { x: 260, y: 310, r: 5, main: false },
    { x: 130, y: 290, r: 4, main: false },
    { x: 80, y: 200, r: 3, main: false },
    { x: 200, y: 80, r: 3, main: false },
    { x: 320, y: 160, r: 3, main: false },
    { x: 180, y: 320, r: 4, main: false },
    { x: 70, y: 330, r: 3, main: false },
    { x: 340, y: 300, r: 3, main: false },
    { x: 160, y: 160, r: 3, main: false },
    { x: 240, y: 240, r: 3, main: false },
    { x: 300, y: 60, r: 2, main: false },
    { x: 60, y: 100, r: 2, main: false },
  ];

  // Generate connections between nearby nodes
  const connections: { from: number; to: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        connections.push({ from: i, to: j });
      }
    }
  }

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className="w-full h-full">
      <defs>
        <radialGradient id="nd-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#051510" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
        <radialGradient id="nd-glow" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <filter id="nd-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="400" rx="16" fill="url(#nd-bg)" />

      {/* Subtle grid */}
      {Array.from({ length: 11 }, (_, i) => (
        <g key={`grid-${i}`}>
          <line x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="#10b981" strokeOpacity="0.02" strokeWidth="0.5" />
          <line x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#10b981" strokeOpacity="0.02" strokeWidth="0.5" />
        </g>
      ))}

      {/* Center glow */}
      <circle cx="200" cy="200" r="120" fill="url(#nd-glow)" />

      {/* Connections */}
      {connections.map(({ from, to }, i) => (
        <line
          key={`conn-${i}`}
          x1={nodes[from].x}
          y1={nodes[from].y}
          x2={nodes[to].x}
          y2={nodes[to].y}
          stroke="#10b981"
          strokeOpacity="0.12"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="strokeDashoffset"
            values="8;0"
            dur={`${2 + (i % 3)}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* Data pulse along connections */}
      {connections.slice(0, 8).map(({ from, to }, i) => (
        <circle key={`pulse-${i}`} r="2" fill="#10b981" opacity="0.5">
          <animateMotion
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
            path={`M${nodes[from].x},${nodes[from].y} L${nodes[to].x},${nodes[to].y}`}
          />
          <animate
            attributeName="opacity"
            values="0;0.6;0"
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          {node.main && (
            <circle cx={node.x} cy={node.y} r="20" fill="#10b981" fillOpacity="0.05" filter="url(#nd-blur)" />
          )}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="#10b981"
            fillOpacity={node.main ? 0.4 : 0.15}
            stroke="#10b981"
            strokeOpacity={node.main ? 0.5 : 0.2}
            strokeWidth={node.main ? 1.5 : 0.8}
          >
            <animate
              attributeName="fillOpacity"
              values={`${node.main ? 0.4 : 0.15};${node.main ? 0.7 : 0.3};${node.main ? 0.4 : 0.15}`}
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          {node.main && (
            <circle cx={node.x} cy={node.y} r="2" fill="#fff" opacity="0.8" />
          )}
        </g>
      ))}
    </svg>
  );
}
