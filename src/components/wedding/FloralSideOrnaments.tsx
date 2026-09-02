function Blossom({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g
      className="sketched-blossom"
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-13"
          rx="7.5"
          ry="13.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.2" />
      {[18, 90, 162, 234, 306].map((angle) => (
        <path
          key={angle}
          d="M0-2v-8m0-1 1.5-2M0-11l-1.5-2"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
  );
}

type FloralVariant = "blossoms" | "wildflowers" | "leaves";

function BlossomBranch() {
  return (
    <>
      <path
        className="vine-stem"
        d="M139 555C115 504 70 473 77 420c7-51 46-70 39-122-7-54-55-74-48-128 5-42 35-68 65-91"
      />
      <path
        className="vine-stem fine"
        d="M77 420c-27-5-48-22-62-51M112 329c23-9 37-28 40-55M71 193c-26-7-45-24-56-50M97 128c-7-34 2-61 27-82"
      />
      <path
        className="vine-stem fine"
        d="M95 473c22-7 39-22 51-44M99 371c-24-11-39-30-45-58M84 239c24-10 40-29 47-55M101 111c-23-3-40-14-53-33"
      />
      <path className="vine-leaf" d="M94 480c21-17 41-18 61-3-19 18-39 19-61 3Z" />
      <path className="vine-leaf" d="M71 402c-24-4-42 6-53 28 24 7 43-3 53-28Z" />
      <path className="vine-leaf" d="M105 343c23-13 43-10 60 8-22 15-42 12-60-8Z" />
      <path className="vine-leaf" d="M68 210c-24-7-43 1-57 21 22 10 42 3 57-21Z" />
      <path className="vine-leaf" d="M98 135c21-15 41-14 59 3-20 17-40 16-59-3Z" />
      <path className="leaf-vein" d="M99 478h47M65 407l-39 18M111 341l42 8M61 213l-41 15M105 133l42 3" />
      <Blossom x={73} y={445} scale={1.05} rotate={-12} />
      <Blossom x={25} y={360} scale={0.82} rotate={18} />
      <Blossom x={112} y={302} scale={1.15} rotate={8} />
      <Blossom x={54} y={176} scale={0.95} rotate={-18} />
      <Blossom x={127} y={82} scale={0.76} rotate={20} />
    </>
  );
}

function WildflowerBranch() {
  return (
    <>
      <path className="vine-stem" d="M128 558C111 473 108 380 115 286c4-59 1-127-17-218" />
      <path className="vine-stem fine" d="M116 455c-42-35-66-82-72-141M114 375c29-39 40-84 32-136M113 292c-35-28-57-63-67-106M103 165c21-34 27-72 18-113" />
      <path className="vine-stem fine" d="M91 535c-34-37-53-82-56-135M130 510c12-46 8-87-11-124M77 431c-23-7-42-20-57-39" />
      <path className="grass-leaf" d="M110 477C78 445 65 408 72 366M120 420c22-35 29-72 20-111M93 331c-26-26-38-57-35-93M111 249c19-29 24-61 15-96" />
      <Blossom x={43} y={307} scale={0.68} rotate={10} />
      <Blossom x={143} y={230} scale={0.82} rotate={-8} />
      <Blossom x={45} y={180} scale={0.58} rotate={22} />
      <g className="seed-head" transform="translate(97 61)">
        <circle cx="0" cy="0" r="13" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path key={angle} d="M0-13v-12" transform={`rotate(${angle})`} />
        ))}
      </g>
      <g className="seed-head small" transform="translate(20 388)">
        <circle cx="0" cy="0" r="8" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path key={angle} d="M0-8v-8" transform={`rotate(${angle})`} />
        ))}
      </g>
    </>
  );
}

function LeafyBranch() {
  const leaves = [
    [108, 466, -42],
    [66, 428, 42],
    [118, 378, -38],
    [58, 336, 38],
    [108, 282, -44],
    [49, 238, 40],
    [96, 183, -38],
    [43, 137, 42],
    [85, 84, -35],
  ];

  return (
    <>
      <path className="vine-stem leafy-stem" d="M137 552C85 492 63 432 76 365c13-65 47-103 36-169-8-47-31-91-76-139" />
      <path className="vine-stem fine" d="M91 481c28-12 46-32 56-60M72 409c-27-12-46-31-58-57M105 313c24-14 39-35 45-63M104 220c-27-10-48-27-62-51M68 118c18-17 27-37 29-62" />
      {leaves.map(([x, y, rotate], index) => (
        <g
          className="eucalyptus-leaf"
          key={`${x}-${y}`}
          transform={`translate(${x} ${y}) rotate(${rotate})`}
        >
          <ellipse cx="0" cy="0" rx={index % 2 ? 10 : 12} ry={index % 2 ? 19 : 22} />
          <path d="M0-17v34" />
        </g>
      ))}
      <circle className="berry" cx="31" cy="344" r="5" />
      <circle className="berry" cx="23" cy="333" r="4" />
      <circle className="berry" cx="36" cy="327" r="3.5" />
      <circle className="berry" cx="137" cy="244" r="5" />
      <circle className="berry" cx="145" cy="231" r="3.5" />
    </>
  );
}

function FloralVine({
  side,
  variant,
}: {
  side: "left" | "right";
  variant: FloralVariant;
}) {
  return (
    <svg
      className={`floral-vine floral-vine-${side} floral-vine-${variant}`}
      viewBox="0 0 150 560"
      aria-hidden="true"
    >
      {variant === "blossoms" && <BlossomBranch />}
      {variant === "wildflowers" && <WildflowerBranch />}
      {variant === "leaves" && <LeafyBranch />}
    </svg>
  );
}

export function FloralSideOrnaments({
  light = false,
  variant = "blossoms",
}: {
  light?: boolean;
  variant?: FloralVariant;
}) {
  return (
    <div className={`floral-side-ornaments${light ? " light" : ""}`}>
      <FloralVine side="left" variant={variant} />
      <FloralVine side="right" variant={variant} />
    </div>
  );
}
