import React, { useEffect, useMemo, useRef, useState } from "react";

// interface CellImage {
//   [key: string]: string;
// }

// interface AxialCoord {
//   q: number;
//   r: number;
// }

// const HexGrid = () => {
//   const [cellImages, setCellImages] = useState<CellImage>({});
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedCell, setSelectedCell] = useState<string | null>(null);

//   const handleCellClick = (cellKey: string) => {
//     setSelectedCell(cellKey);
//     fileInputRef.current?.click();
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !selectedCell) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       setCellImages(prev => ({
//         ...prev,
//         [selectedCell]: imageUrl
//       }));
//       toast.success('Image uploaded successfully!');
//     };
//     reader.readAsDataURL(file);
    
//     // Reset file input
//     event.target.value = '';
//     setSelectedCell(null);
//   };

//   const getCellStyle = (cellKey: string) => {
//     const image = cellImages[cellKey];
//     if (image) {
//       return {
//         backgroundImage: `url(${image})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat'
//       };
//     }
//     return {};
//   };

//   // Generate hexagonal coordinates for the hollow center pattern
//   const generateHexCoordinates = (): AxialCoord[] => {
//     const coords: AxialCoord[] = [];
//     const outerRadius = 6;
    
//     for (let q = -outerRadius; q <= outerRadius; q++) {
//       const r1 = Math.max(-outerRadius, -q - outerRadius);
//       const r2 = Math.min(outerRadius, -q + outerRadius);
      
//       for (let r = r1; r <= r2; r++) {
//         const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
        
//         // Create hollow center pattern - exclude inner cells to create the hollow center
//         const isInnerHollow = (
//           (distance <= 2) || // Inner core
//           (distance === 3 && Math.abs(q) <= 1 && Math.abs(r) <= 1) || // Additional inner cells
//           (distance === 3 && Math.abs(-q - r) <= 1 && (Math.abs(q) <= 1 || Math.abs(r) <= 1))
//         );
        
//         if (!isInnerHollow) {
//           coords.push({ q, r });
//         }
//       }
//     }
    
//     return coords;
//   };

//   // Group coordinates by row (r coordinate) and sort by column (q coordinate)
//   const groupByRows = (coords: AxialCoord[]) => {
//     const rows: { [key: number]: AxialCoord[] } = {};
    
//     coords.forEach(coord => {
//       if (!rows[coord.r]) {
//         rows[coord.r] = [];
//       }
//       rows[coord.r].push(coord);
//     });
    
//     // Sort each row by q coordinate
//     Object.keys(rows).forEach(r => {
//       rows[parseInt(r)].sort((a, b) => a.q - b.q);
//     });
    
//     return rows;
//   };

//   const hexCoords = generateHexCoordinates();
//   const rowGroups = groupByRows(hexCoords);
//   const sortedRows = Object.keys(rowGroups).map(Number).sort((a, b) => a - b);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 lg:p-8">
//       <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-10">
//         <Link 
//           to="/" 
//           className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg transition-colors text-sm sm:text-base"
//         >
//           ← Back to Grid
//         </Link>
//       </div>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         className="hidden"
//       />
      
//       <div className="mb-2 sm:mb-4 lg:mb-8 text-center px-4">
//         <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Flexagonal Grid</h1>
//         <p className="text-xs sm:text-sm lg:text-base text-gray-600">Click on any cell to upload an image</p>
//       </div>
      
//       <div className="hex-honeycomb-container">
//         {sortedRows.map((r, rowIndex) => {
//           const isEvenRow = r % 2 === 0;
//           const rowCells = rowGroups[r];
//           // Merge plan: rows 5..9 (1-based) => [2,3,4,3,2]
//           const mergePlan: Record<number, number> = { 4: 2, 5: 3, 6: 4, 7: 3, 8: 2 };
//           const mergeCount = mergePlan[rowIndex] ?? 0;
          
//           return (
//             <div 
//               key={r} 
//               className="hex-honeycomb-row"
//               style={{
//                 marginLeft: isEvenRow ? '0px' : '35px', // Offset for odd rows
//               }}
//             >
//               {(() => {
//                 // If this row has a merge requirement and enough cells, render with a merged block centered
//                 if (mergeCount > 0 && rowCells.length >= mergeCount) {
//                   const startIndex = Math.floor((rowCells.length - mergeCount) / 2);
//                   const endIndex = startIndex + mergeCount; // exclusive

//                   const pre = rowCells.slice(0, startIndex);
//                   const post = rowCells.slice(endIndex);

//                   return (
//                     <>
//                       {pre.map((coord) => {
//                         const cellKey = `${coord.q}-${coord.r}`;
//                         return (
//                           <div
//                             key={cellKey}
//                             className="hex-honeycomb-cell-rotated"
//                             style={getCellStyle(cellKey)}
//                             onClick={() => handleCellClick(cellKey)}
//                             role="button"
//                             tabIndex={0}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter' || e.key === ' ') {
//                                 e.preventDefault();
//                                 handleCellClick(cellKey);
//                               }
//                             }}
//                           >
//                             {!cellImages[cellKey] && (
//                               <div className="hex-cell-content">
//                                 <span className="text-white text-xs sm:text-sm font-medium opacity-70">+</span>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}

//                       {/* Merged block spanning mergeCount cells */}
//                       <div
//                         className="hex-merged-block"
//                         style={{ ['--merge-cells' as any]: String(mergeCount) }}
//                         aria-label={`Merged ${mergeCount} cells`}
//                       />

//                       {post.map((coord) => {
//                         const cellKey = `${coord.q}-${coord.r}`;
//                         return (
//                           <div
//                             key={cellKey}
//                             className="hex-honeycomb-cell-rotated"
//                             style={getCellStyle(cellKey)}
//                             onClick={() => handleCellClick(cellKey)}
//                             role="button"
//                             tabIndex={0}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter' || e.key === ' ') {
//                                 e.preventDefault();
//                                 handleCellClick(cellKey);
//                               }
//                             }}
//                           >
//                             {!cellImages[cellKey] && (
//                               <div className="hex-cell-content">
//                                 <span className="text-white text-xs sm:text-sm font-medium opacity-70">+</span>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </>
//                   );
//                 }

//                 // Default: render all cells
//                 return rowCells.map((coord) => {
//                   const cellKey = `${coord.q}-${coord.r}`;
//                   return (
//                     <div
//                       key={cellKey}
//                       className="hex-honeycomb-cell-rotated"
//                       style={getCellStyle(cellKey)}
//                       onClick={() => handleCellClick(cellKey)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           e.preventDefault();
//                           handleCellClick(cellKey);
//                         }
//                       }}
//                     >
//                       {!cellImages[cellKey] && (
//                         <div className="hex-cell-content">
//                           <span className="text-white text-xs sm:text-sm font-medium opacity-70">+</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 });
//               })()}
//             </div>
//           );
//         })}
//       </div>
      
//       <div className="mt-2 sm:mt-4 lg:mt-8 text-center max-w-md px-4">
//         <p className="text-xs sm:text-sm text-gray-500">
//           Click on any cell to upload an image. The center area is hollow as shown in the reference.
//         </p>
//       </div>
//     </div>
//   );
 
interface HexCellProps {
  row: number;
  col: number;
  isVisible: boolean;
  active?: boolean;            // NEW
  onClick?: () => void;
}

const HexCell: React.FC<HexCellProps> = ({ row, col, isVisible, active, onClick }) => {
  if (!isVisible) {
    return <div className="w-[60px] h-[52px] sm:w-[80px] sm:h-[69px] lg:w-[100px] lg:h-[87px]" />;
  }

  return (
    <div
      className={`hex-cell ${active ? "hex-cell--active" : ""} cursor-pointer`}
      onClick={onClick}
      data-row={row}
      data-col={col}
      // override the fill when active
      style={{
        background: active ? "#22c55e" : undefined,
        backgroundImage: active ? "none" : undefined,
        zIndex: active ? 10 : undefined,
        borderColor: active ? "#16a34a" : undefined,
      }}
    />
  );
};

const HexGrid: React.FC = () => {
  // rows config (kept as you had it)
  const gridConfig = [
    { cells: 7, offset: true },  
    { cells: 8, offset: false },
    { cells: 9, offset: true },
    { cells: 8, offset: false },
    { cells: 9, offset: true },
    { cells: 8, offset: false },
    { cells: 9, offset: true },
    { cells: 8, offset: false },
    { cells: 9, offset: false },
    { cells: 8, offset: true },
    { cells: 9, offset: false },
    { cells: 8, offset: true },
    { cells: 9, offset: true },
    { cells: 8, offset: false },
    { cells: 7, offset: false },
  ];

  // track which cells are green
  const keyOf = (r: number, c: number) => `${r}:${c}`;
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

  const isCellVisible = (_rowIndex: number, _colIndex: number): boolean => true;

  const handleCellClick = (row: number, col: number) => {
    const k = keyOf(row, col);
    setActiveMap(prev => ({ ...prev, [k]: !prev[k] })); // toggle green
    console.log(`Clicked hex cell at row ${row + 1}, col ${col + 1}`);
  };

  // Merge specification (0-based indices) matching your request
  const mergePlan: Record<number, { startIdx: number; count: number }> = useMemo(() => ({
    3: { startIdx: 3, count: 2 },  // row 4: 4,5
    4: { startIdx: 3, count: 3 },  // row 5: 4,5,6
    5: { startIdx: 2, count: 4 },  // row 6: 3-6
    6: { startIdx: 2, count: 5 },  // row 7: 3-7
    7: { startIdx: 1, count: 6 },  // row 8: 2-7
    8: { startIdx: 2, count: 5 },  // row 9: 3-7
    9: { startIdx: 2, count: 4 },  // row 10: 3-6
    10: { startIdx: 3, count: 3 }, // row 11: 4-6
    11: { startIdx: 3, count: 2 }, // row 12: 4,5
  }), []);

    // Row pattern for hexagonal ring (2–3–4–5–4–3–2)
  const rowPattern = [2, 3, 4, 5, 6, 5, 4, 3, 2];

  // Generate all hex centers
  const generateCenters = () => {
    const centers: [number, number][] = [];
    rowPattern.forEach((count, row) => {
      const y = (row - Math.floor(rowPattern.length / 2)) * (HEX_SIZE * 1.5);
      const startX = -((count - 1) * HEX_SIZE * Math.sqrt(3)) / 2;
      for (let i = 0; i < count; i++) {
        const x = startX + i * (HEX_SIZE * Math.sqrt(3));
        centers.push([x, y]);
      }
    });
    return centers;
  };

    // --- Static merged-center SVG helpers (no drag) ---
  const HEX_SIZE = 25;              // outer ring hex radius
  // const CENTER_SIZE = 30;           // old center hex radius (unused)
  const CENTER_HEX_SIZE = HEX_SIZE; // size for the two center hexes
  const FILL = "#22c55e";           // green fill
  // const STROKE = "#16a34a";         // darker green stroke


  // Keep only the ring (exclude inner cluster)
  const filterRing = (centers: [number, number][]) =>
    centers.filter(([x, y]) => {
      return (
        Math.abs(y) > HEX_SIZE * 1.1 || // keep top/bottom rows
        Math.abs(x) > HEX_SIZE * 1.7    // keep left/right sides
      );
    });

  const outerCenters = filterRing(generateCenters());

  // Two center hexes side-by-side (pointy-top). Distance from origin is size * sqrt(3) / 2
  const centerCenters = useMemo(() => {
    const d = CENTER_HEX_SIZE * Math.sqrt(3) / 2;
    return [
      [-d, 0],
      [ d, 0],
    ] as [number, number][];
  }, [CENTER_HEX_SIZE]);


  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [centerImage, setCenterImage] = useState<string | null>(null);

  // No-op handlers to keep no-drag behavior while satisfying requested structure
  const handleSvgPointerMove = (_e: React.PointerEvent<SVGSVGElement>) => {};
  const endDrag = (_e?: React.PointerEvent<SVGSVGElement>) => {};
  const handleCenterClick = () => {
    console.log('[HexGrid] Center/outer clicked -> opening file picker');
    // Trigger hidden file input for image selection
    fileInputRef.current?.click();
  };
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('[HexGrid] File selected:', file.name, file.type, file.size);
    const url = URL.createObjectURL(file);
    setCenterImage(url);
    // allow re-selecting the same file later
    e.currentTarget.value = '';
  };

  // Convert axial coords (q, r) to pixel for pointy-top hexes
  const axialToPixel = (q: number, r: number, size: number) => {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const y = size * 1.5 * r;
    return [x, y] as const;
  };

  // // Generate 6 outer centers around (0,0) in axial ring (radius 1)
  // const outerCenters = useMemo(() => {
  //   const neighbors: Array<[number, number]> = [
  //     [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1],
  //   ];
  //   return neighbors.map(([q, r]) => axialToPixel(q, r, CENTER_SIZE));
  // }, []);

  // Build hex polygon points string for SVG
  const getHexPoints = (cx: number, cy: number, size: number) => {
    // pointy-top: angles start at -90deg, step 60deg
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < 6; i++) {
      const angle = (-90 + i * 60) * (Math.PI / 180);
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      pts.push([x, y]);
    }
    return pts.map(([x, y]) => `${x},${y}`).join(" ");
  };

  // Measure container size to position static SVG overlay
  useEffect(() => {
    const measure = () => {
      const root = containerRef.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      setOverlaySize({ w: Math.round(box.width), h: Math.round(box.height) });
    };
    const onResize = () => requestAnimationFrame(measure);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="grid-container">
      <div className="relative" ref={containerRef}>
        <div className="flex flex-col items-center">
          {gridConfig.map((row, rowIndex) => {
            // Merge plan (1-based rows/cols as per request), converted to 0-based indices here
            const spec = mergePlan[rowIndex];

            if (spec && row.cells >= spec.startIdx + spec.count) {
              const pre = Array.from({ length: spec.startIdx });
              const post = Array.from({ length: row.cells - (spec.startIdx + spec.count) });

              return (
                <div key={rowIndex} className={`hex-row ${row.offset ? "offset" : ""}`}>
                  {pre.map((_, colIndex) => {
                    const k = keyOf(rowIndex, colIndex);
                    return (
                      <HexCell
                        key={k}
                        row={rowIndex}
                        col={colIndex}
                        isVisible={isCellVisible(rowIndex, colIndex)}
                        active={!!activeMap[k]}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      />
                    );
                  })}

                  {/* Render hidden placeholders for merged cells so overlay can compute their geometry */}
                  {/* Invisible placeholders to preserve gap for merged region */}
                  {Array.from({ length: spec.count }, (_, i) => {
                    const colIndex = spec.startIdx + i;
                    const k = keyOf(rowIndex, colIndex);
                    return (
                      <div
                        key={k}
                        className="hex-cell"
                        data-row={rowIndex}
                        data-col={colIndex}
                        style={{ visibility: "hidden", pointerEvents: "none" }}
                      />
                    );
                  })}

                  {post.map((_, postIdx) => {
                    const colIndex = spec.startIdx + spec.count + postIdx;
                    const k = keyOf(rowIndex, colIndex);
                    return (
                      <HexCell
                        key={k}
                        row={rowIndex}
                        col={colIndex}
                        isVisible={isCellVisible(rowIndex, colIndex)}
                        active={!!activeMap[k]}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      />
                    );
                  })}
                </div>
              );
            }

            // Default: no merge in this row
            return (
              <div key={rowIndex} className={`hex-row ${row.offset ? "offset" : ""}`}>
                {Array.from({ length: row.cells }, (_, colIndex) => {
                  const k = keyOf(rowIndex, colIndex);
                  return (
                    <HexCell
                      key={k}
                      row={rowIndex}
                      col={colIndex}
                      isVisible={isCellVisible(rowIndex, colIndex)}
                      active={!!activeMap[k]}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    />
                  );
                })}
              </div>
            );
            
          })}
        </div>
        {/* Static merged center cavity with clipPaths and optional image (single overlay) */}
        {overlaySize.w > 0 && overlaySize.h > 0 && (
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            viewBox="-300 -300 600 600"
            onPointerMove={handleSvgPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            style={{ zIndex: 5 }}
          >
            <defs>
              <clipPath id="clip-center">
                {centerCenters.map(([cx, cy], i) => (
                  <polygon key={`cc-${i}`} points={getHexPoints(cx, cy, CENTER_HEX_SIZE)} />
                ))}
              </clipPath>
              <clipPath id="clip-merged">
                {centerCenters.map(([cx, cy], i) => (
                  <polygon key={`cm-${i}`} points={getHexPoints(cx, cy, CENTER_HEX_SIZE)} />
                ))}
                {outerCenters.map(([x, y], i) => (
                  <polygon key={`m-${i}`} points={getHexPoints(x, y, HEX_SIZE)} />
                ))}
              </clipPath>
              {/* Outer ring merged clip (no boundaries) */}
              <clipPath id="clip-outer-merged">
                {outerCenters.map(([x, y], i) => (
                  <polygon key={`om-${i}`} points={getHexPoints(x, y, HEX_SIZE)} />
                ))}
              </clipPath>
            </defs>

            {centerImage ? (
              <>
                <image
                  href={centerImage}
                  x={-300}
                  y={-300}
                  width={600}
                  height={600}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#clip-merged)"
                  style={{ cursor: "pointer" }}
                  onClick={handleCenterClick}
                />
                {/* Note: no outer rect here so the image remains visible across the entire merged area */}
                {centerCenters.map(([cx, cy], i) => (
                  <polygon
                    key={`co-${i}`}
                    points={getHexPoints(cx, cy, CENTER_HEX_SIZE)}
                    fill="transparent"
                    stroke={FILL}
                    strokeWidth="0.75"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}
              </>
            ) : (
              <>
                {/* Outer ring as a single merged filled shape (no boundaries) */}
                <rect
                  x={-300}
                  y={-300}
                  width={600}
                  height={600}
                  fill={FILL}
                  clipPath="url(#clip-outer-merged)"
                  style={{ cursor: "pointer" }}
                  onClick={handleCenterClick}
                />
                {centerCenters.map(([cx, cy], i) => (
                  <polygon
                    key={`cf-${i}`}
                    points={getHexPoints(cx, cy, CENTER_HEX_SIZE)}
                    fill={FILL}
                    // no stroke for seamless merge appearance
                    style={{ cursor: "pointer" }}
                    onClick={handleCenterClick}
                  />
                ))}
              </>
            )}
          </svg>
        )}
        {/* Hidden file input for center image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default HexGrid;
