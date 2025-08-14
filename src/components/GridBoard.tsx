
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface CellImage {
  [key: string]: string;
}

const GridBoard = () => {
  const [cellImages, setCellImages] = useState<CellImage>({});
  const [uploadOrder, setUploadOrder] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define clockwise order starting from top-left
  const getClockwiseOrder = () => {
    const order = [];
    
    // Top row (left to right)
    for (let col = 0; col < 8; col++) {
      order.push(`0-${col}`);
    }
    
    // Right column (top to bottom, excluding corners)
    for (let row = 1; row < 9; row++) {
      order.push(`${row}-7`);
    }
    
    // Bottom row (right to left, excluding right corner)
    for (let col = 6; col >= 0; col--) {
      order.push(`9-${col}`);
    }
    
    // Left column (bottom to top, excluding corners)
    for (let row = 8; row > 0; row--) {
      order.push(`${row}-0`);
    }
    
    // Bottom extension (left to right)
    for (let col = 2; col <= 4; col++) {
      order.push(`10-${col}`);
    }
    
    return order;
  };

  const clockwiseOrder = getClockwiseOrder();

  const handleCellClick = () => {
    fileInputRef.current?.click();
  };

  const getNextAvailableCell = () => {
    // First image always goes to center
    if (uploadOrder.length === 0) {
      return 'center';
    }
    
    // Find next available cell in clockwise order
    for (const cellKey of clockwiseOrder) {
      if (!uploadOrder.includes(cellKey)) {
        return cellKey;
      }
    }
    
    // If all cells are filled, start replacing from center again
    return 'center';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const targetCell = getNextAvailableCell();
      
      setCellImages(prev => ({
        ...prev,
        [targetCell]: imageUrl
      }));
      
      setUploadOrder(prev => {
        const newOrder = [...prev];
        if (!newOrder.includes(targetCell)) {
          newOrder.push(targetCell);
        }
        return newOrder;
      });
      
      toast.success(`Image uploaded to ${targetCell === 'center' ? 'center cell' : 'border cell'}!`);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    event.target.value = '';
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
        <p className="text-sm text-gray-500 mt-2">
          First image → Center cell | Next images → Clockwise from top-left
        </p>
      </div>
      
      <div className="grid grid-cols-8 gap-1 p-6 bg-white rounded-xl shadow-2xl">
        {/* Top row - 8 cells */}
        {Array.from({ length: 8 }, (_, colIndex) => {
          const cellKey = `0-${colIndex}`;
          return (
            <div
              key={`top-${colIndex}`}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden cursor-pointer"
              style={getCellStyle(cellKey)}
              onClick={handleCellClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick();
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
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden cursor-pointer"
              style={getCellStyle(`${rowIndex + 1}-0`)}
              onClick={handleCellClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick();
                }
              }}
            >
              {!cellImages[`${rowIndex + 1}-0`] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>

            {/* Center cell - only render once and span 6 columns */}
            {rowIndex === 0 && (
              <div
                className="col-span-6 row-span-8 grid-cell flex items-center justify-center text-white font-bold text-lg relative overflow-hidden cursor-pointer"
                style={getCellStyle('center')}
                onClick={handleCellClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick();
                  }
                }}
              >
                {!cellImages['center'] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span>CENTER</span>
                  </div>
                )}
              </div>
            )}

            {/* Right border cell */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden cursor-pointer"
              style={getCellStyle(`${rowIndex + 1}-7`)}
              onClick={handleCellClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick();
                }
              }}
            >
              {!cellImages[`${rowIndex + 1}-7`] && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
                  +
                </div>
              )}
            </div>
          </React.Fragment>
        ))}

        {/* Bottom row - 8 cells */}
        {Array.from({ length: 8 }, (_, colIndex) => {
          const cellKey = `9-${colIndex}`;
          return (
            <div
              key={`bottom-${colIndex}`}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden cursor-pointer"
              style={getCellStyle(cellKey)}
              onClick={handleCellClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick();
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

        {/* Bottom extension - 3 cells centered */}
        <div className="col-start-3 col-span-3 flex gap-1">
          {Array.from({ length: 3 }, (_, colIndex) => {
            const cellKey = `10-${colIndex + 2}`;
            return (
              <div
                key={`extension-${colIndex}`}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden cursor-pointer"
                style={getCellStyle(cellKey)}
                onClick={handleCellClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick();
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
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-gray-500">
          Images upload in sequence: first to center, then clockwise from top-left. Images are automatically clipped to fit each cell.
        </p>
      </div>
    </div>
  );
};

export default GridBoard;
