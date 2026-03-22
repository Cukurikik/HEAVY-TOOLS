import React, { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface CropHandleProps {
  imageUrl: string;
  aspectRatio?: number;
  onCropComplete: (cropData: Cropper.Data) => void;
  className?: string;
}

export const CropHandle: React.FC<CropHandleProps> = ({ imageUrl, aspectRatio, onCropComplete, className = '' }) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      onCropComplete(cropper.getData());
    }
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl bg-black/5 ${className}`}>
      <Cropper
        src={imageUrl}
        style={{ height: 500, width: '100%' }}
        initialAspectRatio={aspectRatio || NaN}
        aspectRatio={aspectRatio || NaN}
        guides={true}
        ref={cropperRef}
        cropend={handleCrop}
        zoomable={true}
        scalable={true}
        rotatable={true}
        background={false}
        responsive={true}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        className="cropper-container-custom"
      />
    </div>
  );
};
