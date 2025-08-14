
import React from 'react';

const GridBoard = () => {
  const handleCellClick = (cellType: string, position?: { row: number, col: number }) => {
    if (cellType === 'center') {
      console.log('Center cell clicked');
    } else {
      console.log(`Border cell clicked: row ${position?.row}, col ${position?.col}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Interactive Grid</h1>
        <p className="text-gray-600">Click on any cell to interact with the grid</p>
      </div>
      
      <div className="grid grid-cols-8 gap-1 p-6 bg-white rounded-xl shadow-2xl">
        {/* Top row - 8 cells */}
        {Array.from({ length: 8 }, (_, colIndex) => (
          <div
            key={`top-${colIndex}`}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse"
            onClick={() => handleCellClick('border', { row: 0, col: colIndex })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCellClick('border', { row: 0, col: colIndex });
              }
            }}
          />
        ))}

        {/* Middle rows with left border, center cell, and right border */}
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <React.Fragment key={`middle-row-${rowIndex}`}>
            {/* Left border cell */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse"
              onClick={() => handleCellClick('border', { row: rowIndex + 1, col: 0 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick('border', { row: rowIndex + 1, col: 0 });
                }
              }}
            />

            {/* Center cell - only render once and span 6 columns */}
            {rowIndex === 0 && (
              <div
                className="col-span-6 row-span-8 grid-cell active:animate-grid-pulse flex items-center justify-center text-white font-bold text-lg"
                onClick={() => handleCellClick('center')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick('center');
                  }
                }}
              >
                CENTER
              </div>
            )}

            {/* Right border cell */}
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse"
              onClick={() => handleCellClick('border', { row: rowIndex + 1, col: 7 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick('border', { row: rowIndex + 1, col: 7 });
                }
              }}
            />
          </React.Fragment>
        ))}

        {/* Bottom row - 8 cells */}
        {Array.from({ length: 8 }, (_, colIndex) => (
          <div
            key={`bottom-${colIndex}`}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse"
            onClick={() => handleCellClick('border', { row: 9, col: colIndex })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCellClick('border', { row: 9, col: colIndex });
              }
            }}
          />
        ))}

        {/* Bottom extension - 3 cells centered */}
        <div className="col-start-3 col-span-3 flex gap-1">
          {Array.from({ length: 3 }, (_, colIndex) => (
            <div
              key={`extension-${colIndex}`}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 grid-cell active:animate-grid-pulse"
              onClick={() => handleCellClick('border', { row: 10, col: colIndex + 2 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCellClick('border', { row: 10, col: colIndex + 2 });
                }
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-gray-500">
          This grid features a large center cell surrounded by individual border cells.
          Each cell responds to hover and click interactions.
        </p>
      </div>
    </div>
  );
};

export default GridBoard;
