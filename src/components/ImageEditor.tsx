
import React, { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw, Move, Maximize } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onImageTransform: (transform: ImageTransform) => void;
  initialTransform?: ImageTransform;
}

export interface ImageTransform {
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

export const ImageEditor = ({ imageUrl, onImageTransform, initialTransform }: ImageEditorProps) => {
  const [transform, setTransform] = useState<ImageTransform>(
    initialTransform || { scale: 1, x: 0, y: 0, rotation: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const updateTransform = useCallback((newTransform: Partial<ImageTransform>) => {
    const updated = { ...transform, ...newTransform };
    setTransform(updated);
    onImageTransform(updated);
  }, [transform, onImageTransform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    updateTransform({ x: newX, y: newY });
  }, [isDragging, dragStart, updateTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => {
    updateTransform({ scale: Math.min(transform.scale + 0.1, 3) });
  };

  const handleZoomOut = () => {
    updateTransform({ scale: Math.max(transform.scale - 0.1, 0.1) });
  };

  const handleReset = () => {
    const resetTransform = { scale: 1, x: 0, y: 0, rotation: 0 };
    setTransform(resetTransform);
    onImageTransform(resetTransform);
  };

  const handleFitToContainer = () => {
    updateTransform({ scale: 1, x: 0, y: 0 });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Editor de Imagem</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="hover:bg-blue-50"
            >
              <ZoomOut size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="hover:bg-blue-50"
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToContainer}
              className="hover:bg-blue-50"
            >
              <Maximize size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="hover:bg-red-50"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <div
            ref={imageRef}
            className={`absolute inset-0 flex items-center justify-center ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageUrl}
              alt="Product"
              className="max-w-none select-none transition-transform duration-150"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
              }}
              draggable={false}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiIHJ4PSI4Ii8+PHBhdGggZD0iTTEwMCA5MGMxMS4wNDYgMCAyMC04Ljk1NCAyMC0yMHMtOC45NTQtMjAtMjAtMjAtMjAgOC45NTQtMjAgMjAgOC45NTQgMjAgMjAgMjB6bTQwIDVINjB2NDBIODBWMTIwaDE1di0xMGg1VjEwNWgtNXptLTgwIDBoMTB2MTBIMTUwdi0xMEg2MHoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';
              }}
            />
          </div>
          
          {/* Drag indicator */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Move size={12} />
            Arraste para mover
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Zoom: {Math.round(transform.scale * 100)}%
            </label>
            <Slider
              value={[transform.scale]}
              onValueChange={([value]) => updateTransform({ scale: value })}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Posição X: {transform.x}px
              </label>
              <Slider
                value={[transform.x]}
                onValueChange={([value]) => updateTransform({ x: value })}
                min={-200}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Posição Y: {transform.y}px
              </label>
              <Slider
                value={[transform.y]}
                onValueChange={([value]) => updateTransform({ y: value })}
                min={-200}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
