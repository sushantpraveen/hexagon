import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface CellImage {
  [key: string]: string;
}

const SquareGrid = () => {
  const [cellImages, setCellImages] = useState<CellImage>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState<number>(0);

  // Define the clockwise order for border cells (28 total border cells in 9x9 grid)
  const getBorderCellOrder = () => {
    const borderCells: string[] = [];
    
    // Top row (0,0 to 0,8) - 9 cells
    for (let col = 0; col < 9; col++) {
      borderCells.push(`0-${col}`);
    }
    
    // Right edge (1,8 to 7,8) - 7 cells
    for (let row = 1; row < 8; row++) {
      borderCells.push(`${row}-8`);
    }
    
    // Bottom row (8,8 to 8,0) - 9 cells
    for (let col = 8; col >= 0; col--) {
      borderCells.push(`8-${col}`);
    }
    
    // Left edge (7,0 to 1,0) - 7 cells
    for (let row = 7; row > 0; row--) {
      borderCells.push(`${row}-0`);
    }
    
    return borderCells;
  };

  const getNextCellToFill = (count: number) => {
    if (count === 0) return 'center';
    
    const borderOrder = getBorderCellOrder();
    const borderIndex = count - 1;
    
    if (borderIndex < borderOrder.length) {
      return borderOrder[borderIndex];
    }
    
    return null; // Grid is full
  };

  const handleCellClick = (cellKey: string) => {
    console.log(`Cell clicked: ${cellKey}`);
    
    // Check if cell already has an image (replacement mode)
    if (cellImages[cellKey]) {
      setSelectedCell(cellKey);
      fileInputRef.current?.click();
      return;
    }
    
    // For new uploads, check if this is the next cell in sequence
    const nextCell = getNextCellToFill(uploadCount);
    
    if (nextCell && cellKey === nextCell) {
      setSelectedCell(cellKey);
      fileInputRef.current?.click();
    } else if (nextCell) {
      toast.error(`Please upload to the ${nextCell === 'center' ? 'center cell' : 'next cell in sequence'} first`);
    } else {
      toast.error('Grid is full');
    }
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
      const wasReplacement = !!cellImages[selectedCell];
      
      setCellImages(prev => ({
        ...prev,
        [selectedCell]: imageUrl
      }));
      
      if (!wasReplacement) {
        setUploadCount(prev => prev + 1);
      }
      
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

  const isCellClickable = (cellKey: string) => {
    // If cell has image, it's clickable for replacement
    if (cellImages[cellKey]) return true;
    
    // Otherwise, check if it's the next cell in sequence
    const nextCell = getNextCellToFill(uploadCount);
    return nextCell === cellKey;
  };

  const renderCell = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    
    // Check if this is part of the center area (rows 2-6, cols 2-6)
    if (row >= 2 && row <= 6 && col >= 2 && col <= 6) {
      // Only render the center cell once at position 2,2
      if (row === 2 && col === 2) {
        const isClickable = isCellClickable('center');
        return (
          <div
            key={`center-${row}-${col}`}
            className={`col-span-5 row-span-5 grid-cell active:animate-grid-pulse flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden ${
              isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
            style={getCellStyle('center')}
            onClick={() => handleCellClick('center')}
            role="button"
            tabIndex={0}
          >
            {!cellImages['center'] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span>CENTER</span>
              </div>
            )}
          </div>
        );
      }
      // Skip other center cells
      return null;
    }

    const isClickable = isCellClickable(cellKey);
    
    return (
      <div
        key={`cell-${row}-${col}`}
        className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse relative overflow-hidden ${
          isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        style={getCellStyle(cellKey)}
        onClick={() => handleCellClick(cellKey)}
        role="button"
        tabIndex={0}
      >
        {!cellImages[cellKey] && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-70">
            +
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="fixed top-4 left-4 z-10">
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          ← Original Grid
        </Link>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Square Grid Layout</h1>
        <p className="text-gray-600">Upload images in sequence: center first, then clockwise from top-left</p>
        <p className="text-sm text-gray-500 mt-2">
          Images uploaded: {uploadCount} / 29 (1 center + 28 border cells)
        </p>
      </div>
      
      <div className="grid grid-cols-9 gap-1 p-6 bg-white rounded-xl shadow-2xl">
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => renderCell(row, col))
        )}
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-gray-500">
          Click on highlighted cells to upload images in sequence. Click on existing images to replace them.
        </p>
      </div>
    </div>
  );
};

export default SquareGrid;
