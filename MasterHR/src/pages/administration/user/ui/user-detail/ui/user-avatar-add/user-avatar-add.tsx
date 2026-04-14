import { RotateCw, Upload } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib';

import type { Crop, PixelCrop } from 'react-image-crop';
import type { FC } from 'react';

import 'react-image-crop/dist/ReactCrop.css';

interface AvatarUploadDialogProps {
  closeDialog: () => void;
  currentAvatar?: string;
  onSave?: (file: File) => Promise<void>;
  aspect?: number;
  circularCrop?: boolean;
  previewSize?: number;
  fallback?: string;
  title?: string;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const AvatarUploadDialog: FC<AvatarUploadDialogProps> = ({
  closeDialog,
  onSave,
  aspect = 1,
  circularCrop = true,
  previewSize = 120,
  title = 'Загрузить фото',
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      closeDialog();
    }
  };

  const onSelectFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
    });
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const handleDragOver = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const crop = centerAspectCrop(width, height, aspect);
      setCrop(crop);
    },
    [aspect]
  );

  const createCroppedImage = useCallback(async () => {
    const image = imgRef.current;

    if (!image || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
            resolve(file);
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }, [completedCrop, rotation]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const croppedFile = await createCroppedImage();

      if (croppedFile && onSave) {
        await onSave(croppedFile);
      }

      handleOpenChange(false);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Ошибка при обработке изображения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleBack = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setRotation(0);
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      if (rotation !== 0) {
        ctx.translate(crop.width / 2, crop.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-crop.width / 2, -crop.height / 2);
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      ctx.restore();
    }
  }, [completedCrop, rotation]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {!imgSrc ? (
            <div
              className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileInput} className='hidden' />

              <div className='text-center'>
                <Upload className='mx-auto h-12 w-12 text-gray-400' />
                <p className='mt-2 text-sm font-medium'>Перетащите фото сюда или выберите файл</p>
                <p className='mt-1 text-xs text-gray-500'>PNG, JPG до 5MB</p>
              </div>
            </div>
          ) : (
            <>
              <div className='flex justify-center'>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  circularCrop={circularCrop}
                  className='max-h-[350px]'
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt='Crop me'
                    style={{ transform: `rotate(${rotation}deg)` }}
                    onLoad={onImageLoad}
                    className='max-h-[350px] object-contain'
                  />
                </ReactCrop>
              </div>

              {completedCrop && (
                <div className='flex flex-col items-center gap-2'>
                  <p className='text-sm text-gray-500'>Предпросмотр:</p>
                  <canvas
                    ref={previewCanvasRef}
                    className='rounded-full border-2 border-gray-200'
                    style={{
                      width: previewSize,
                      height: previewSize,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}

              <div className='flex justify-center'>
                <Button type='button' variant='outline' size='sm' onClick={handleBack}>
                  Выбрать другой файл
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter className='flex justify-between'>
          {imgSrc ? (
            <>
              <Button type='button' variant='outline' onClick={handleRotate}>
                <RotateCw className='mr-2 h-4 w-4' />
                Повернуть
              </Button>

              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Отмена
                </Button>
                <Button type='button' onClick={handleSave} disabled={!completedCrop?.width || isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            </>
          ) : (
            <div className='flex w-full justify-end'>
              <Button type='button' variant='outline' onClick={handleCancel}>
                Отмена
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
