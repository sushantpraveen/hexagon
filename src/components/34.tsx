
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface CellImage {
  [key: string]: string;
}

const GridBoard = () => {
  const [cellImages, setCellImages] = useState<CellImage>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Unique component-scoped ID helpers
  const COMP_ID = 'grid-34';
  const cid = (section: string, row: number, col: number) => `${COMP_ID}:${section}:${row}-${col}`;

  const handleCellClick = (cellKey: string) => {
    setSelectedCell(cellKey);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCell) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCellImages(prev => ({
        ...prev,
        [selectedCell]: imageUrl
      }));
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    event.target.value = '';
    setSelectedCell(null);
  };

  const getCellStyle = (cellKey: string) => {
    const image = cellImages[cellKey];
    if (image) {
      return {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Interactive Grid</h1>
        <p className="text-gray-600">Click on any cell to upload an image</p>
      </div>
      
      <div className="grid grid-cols-9 gap-1 p-6 bg-white rounded-xl shadow-2xl">
        
         {/* Top extension - 1 cells centered (non-intrusive full-row) */}
         <div className="col-span-9 flex justify-center gap-1">
          {Array.from({ length: 1 }, (_, colIndex) => {
            const cellKey = cid('topExt', -1, colIndex + 2);
            return (
              <div
                key={cellKey}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
                style={getCellStyle(cellKey)}
                onClick={() => handleCellClick(cellKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick(cellKey);
                  }
                }}
              >
                {!cellImages[cellKey] && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                    +
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Top row - 9 cells */}
        {Array.from({ length: 9 }, (_, colIndex) => {
          const cellKey = cid('top', 0, colIndex);
          return (
            <div
              key={cellKey}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cellKey)}
              onClick={() => handleCellClick(cellKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cellKey);
                }
              }}
            >
              {!cellImages[cellKey] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>
          );
        })}

        {/* Middle rows with left border, center cell, and right border */}
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <React.Fragment key={`middle-row-${rowIndex}`}>
            {/* Left border cell */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cid('leftA', rowIndex + 1, 0))}
              onClick={() => handleCellClick(cid('leftA', rowIndex + 1, 0))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cid('leftA', rowIndex + 1, 0));
                }
              }}
            >
              {!cellImages[cid('leftA', rowIndex + 1, 0)] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>

            {/* Left border cell (second, adjacent) */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cid('leftB', rowIndex + 1, 1))}
              onClick={() => handleCellClick(cid('leftB', rowIndex + 1, 1))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cid('leftB', rowIndex + 1, 1));
                }
              }}
            >
              {!cellImages[cid('leftB', rowIndex + 1, 1)] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>

            {/* Center cell - only render once and span 5 columns */}
            {rowIndex === 0 && (
              <div
                className="col-span-5 row-span-8 grid-cell active:animate-grid-pulse flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
                style={getCellStyle(cid('center', 0, 0))}
                onClick={() => handleCellClick(cid('center', 0, 0))}
                role="button"
                tabIndex={0}
              >
                {!cellImages[cid('center', 0, 0)] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span>CENTER</span>
                  </div>
                )}
              </div>
            )}

            {/* Right border cell (first) */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cid('rightA', rowIndex + 1, 7))}
              onClick={() => handleCellClick(cid('rightA', rowIndex + 1, 7))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cid('rightA', rowIndex + 1, 7));
                }
              }}
            >
              {!cellImages[cid('rightA', rowIndex + 1, 7)] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>

            {/* Right border cell (second, adjacent) */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cid('rightB', rowIndex + 1, 8))}
              onClick={() => handleCellClick(cid('rightB', rowIndex + 1, 8))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cid('rightB', rowIndex + 1, 8));
                }
              }}
            >
              {!cellImages[cid('rightB', rowIndex + 1, 8)] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>
          </React.Fragment>
        ))}

        {/* Bottom row - 9 cells */}
        {Array.from({ length: 9 }, (_, colIndex) => {
          const cellKey = cid('bottom', 9, colIndex);
          return (
            <div
              key={cellKey}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden"
              style={getCellStyle(cellKey)}
              onClick={() => handleCellClick(cellKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick(cellKey);
                }
              }}
            >
              {!cellImages[cellKey] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>
          );
        })}

      </div>
      
      

      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-gray-500">
          Click on any cell to upload an image. Images will be automatically clipped to fit each cell perfectly.
        </p>
      </div>
    </div>
  );
};

export default GridBoard;
