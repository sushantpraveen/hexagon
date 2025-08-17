import React, { useRef, useState, Suspense, lazy } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Link } from 'react-router-dom';

interface CellImage {
  [key: string]: string;
}

const GridBoard = () => {
  const [cellImages, setCellImages] = useState<CellImage>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [numberInput, setNumberInput] = useState<string>("");
  const [PreviewComp, setPreviewComp] = useState<React.LazyExoticComponent<React.ComponentType> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Map of all TSX components in this folder
  // We will look for files like "33.tsx", "37.tsx", or any "n.tsx"
  const componentModules = import.meta.glob('./*.tsx');

  const handleCellClick = (cellType: string, position?: { row: number, col: number }) => {
    let cellKey: string;
    
    if (cellType === 'center') {
      cellKey = 'center';
      console.log('Center cell clicked');
    } else {
      cellKey = `${position?.row}-${position?.col}`;
      console.log(`Border cell clicked: row ${position?.row}, col ${position?.col}`);
    }
    
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

  const loadComponentByNumber = async (n: number) => {
    setLoadError(null);
    setPreviewComp(null);

    const path = `./${n}.tsx` as const;
    // Only allow files with numeric names like 33.tsx, 37.tsx, etc.
    if (!/^[0-9]+\.tsx$/.test(`${n}.tsx`)) {
      setLoadError('Please enter a valid number.');
      return;
    }

    if (componentModules[path]) {
      // Wrap the dynamic import in React.lazy
      const loader = componentModules[path] as () => Promise<{ default: React.ComponentType<any> }>;
      const LazyComp = lazy(loader);
      setPreviewComp(() => LazyComp);
    } else {
      setLoadError(`Component ${n}.tsx not found in src/components.`);
    }
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(numberInput);
    if (Number.isNaN(n)) {
      setLoadError('Enter a valid number.');
      return;
    }
    loadComponentByNumber(n);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Navigation Links */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Link 
          to="/square-grid" 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-sm"
        >
          Square Grid
        </Link>
        <Link 
          to="/hex-grid" 
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-sm"
        >
          Hex Grid
        </Link>
      </div>

      {/* Preview Controller */}
      <Card className="w-full max-w-2xl mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Component Preview Loader</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePreviewSubmit} className="grid grid-cols-1 sm:grid-cols-[220px_1fr_auto] items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="preview-number">Component number</Label>
              <Input
                id="preview-number"
                type="number"
                inputMode="numeric"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="e.g. 33 or 37"
              />
            </div>
            <div className="text-xs text-slate-500 sm:self-center">
              Enter a number to load a file named <code className="px-1 py-0.5 rounded bg-slate-100">{`{n}`}.tsx</code> from <code className="px-1 py-0.5 rounded bg-slate-100">src/components</code>.
            </div>
            <Button type="submit" className="sm:justify-self-end">Load</Button>
          </form>

          <Separator className="my-4" />

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => loadComponentByNumber(33)}>
              Load 33.tsx
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadComponentByNumber(37)}>
              Load 37.tsx
            </Button>
          </div>

          {loadError && (
            <p className="mt-3 text-sm text-red-600" role="alert">{loadError}</p>
          )}
        </CardContent>
      </Card>

      {/* Preview Area */}
      <div className="w-full max-w-5xl mb-8">
        {PreviewComp ? (
          <Card>
            <CardContent className="p-0">
              <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading preview...</div>}>
                <PreviewComp />
              </Suspense>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-slate-500 text-center">
              Enter a number to preview a component (e.g. 33 or 37).
            </CardContent>
          </Card>
        )}
      </div>

      {/* Grid UI area (existing feature) */}
      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        {/* TODO: Render your grid here. Leaving blank as original code had no rendered grid markup in the snippet. */}
      </div>
    </div>
  );
};

export default GridBoard;
