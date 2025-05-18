import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWidgets } from '../../hooks/useWidgets';

interface BaseWidgetProps {
  id: string;
  title: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  id,
  title,
  size,
  className,
  children,
}) => {
  const { remove, updateSize } = useWidgets();

  const handleResize = () => {
    const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];
    const currentIndex = sizes.indexOf(size);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    updateSize(id, nextSize);
  };

  return (
    <Card 
      className={cn(
        'h-full w-full transition-all duration-300',
        className
      )}
    >
      <CardHeader className="bg-theme-subtle">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="truncate text-base">{title}</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Resize widget"
              onClick={handleResize}
              className="h-7 w-7 p-0"
            >
              {size === 'lg' ? (
                <Minimize2 size={15} />
              ) : (
                <Maximize2 size={15} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Remove widget"
              onClick={() => remove(id)}
              className="h-7 w-7 p-0 text-theme-secondary hover:text-error"
            >
              <X size={15} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
};