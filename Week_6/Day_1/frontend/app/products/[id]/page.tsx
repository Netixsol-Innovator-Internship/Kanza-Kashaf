"use client";

import React, { useEffect, useState } from "react";
import {
  useGetProductQuery,
  useAddToCartMutation,
  useGetProfileQuery,
} from "../../../store/api";
import ProductGallery from "../../components/ProductGallery";
import ProductInfo from "../../components/ProductInfo";
import ReviewSection from "../../components/ReviewSection";
import AlsoLike from "../../components/AlsoLike";
import { getSocket } from "../../../lib/socket";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params?.id;
  const {
    data: product,
    isLoading: productLoading,
    refetch: refetchProduct,
  } = useGetProductQuery(productId || "", { skip: !productId });

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCart] = useAddToCartMutation();
  const { data: user } = useGetProfileQuery();

  useEffect(() => {
    if (product && product.variants && product.variants.length) {
      setSelectedVariantIndex(0);
      setSelectedImageIndex(0);
      setSelectedSizeIndex(
        product.variants[0].sizes && product.variants[0].sizes.length
          ? 0
          : null
      );
    }
  }, [product]);

  useEffect(() => {
    if (!productId) return;
    const socket = getSocket();
    if (!socket) return;

    const refresh = () => refetchProduct();

    socket.on(`review-added:${productId}`, refresh);
    socket.on(`product-updated:${productId}`, refresh);

    return () => {
      socket.off(`review-added:${productId}`, refresh);
      socket.off(`product-updated:${productId}`, refresh);
    };
  }, [productId, refetchProduct]);

  const variant = product?.variants?.[selectedVariantIndex] || null;

  const handleAddToCart = async () => {
    try {
      if (!productId) return;
      if (!user) {
        alert('Please sign up or log in to continue');
        window.location.href = '/signup';
        return;
      }
      if (!variant) {
        alert("Select variant");
        return;
      }

      const sizeObj =
        selectedSizeIndex !== null ? variant.sizes[selectedSizeIndex] : undefined;
      const sizeVal = sizeObj ? sizeObj.size : undefined;

      await addToCart({
        id: productId,
        body: {
          productId,
          quantity,
          color: variant.color,
          size: sizeVal,
        },
      }).unwrap();

      alert("Added to cart");
    } catch (e: any) {
      alert(
        e?.data?.message ||
          e?.message ||
          "Failed to add to cart. Are you logged in?"
      );
    }
  };

  if (productLoading || !product)
    return <div className="max-w-6xl mx-auto p-8">Loading...</div>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: gallery */}
          <div className="md:col-span-2">
            {/* Mobile: just show big image */}
            <div className="block md:hidden mb-4">
              <img
                src={
                  variant?.images?.[selectedImageIndex] ||
                  variant?.images?.[0] ||
                  "/placeholder.png"
                }
                alt="main"
                className="w-full h-80 object-cover rounded border"
              />
            </div>

            {/* Desktop: show thumbnails + big image */}
            <div className="hidden md:block">
              <ProductGallery
                variant={variant}
                selectedImage={selectedImageIndex}
                onSelectImage={(i) => setSelectedImageIndex(i)}
              />
            </div>
          </div>

          {/* Right: product info */}
          <div>
            <ProductInfo
              product={product}
              selectedVariantIndex={selectedVariantIndex}
              onSelectVariant={(i) => {
                setSelectedVariantIndex(i);
                setSelectedImageIndex(0);
                setSelectedSizeIndex(
                  product?.variants?.[i]?.sizes &&
                    product?.variants?.[i]?.sizes.length
                    ? 0
                    : null
                );
                setQuantity(1);
              }}
              selectedSizeIndex={selectedSizeIndex}
              onSelectSize={(i) => {
                setSelectedSizeIndex(i);
                setQuantity(1);
              }}
              quantity={quantity}
              setQuantity={(n: number) => setQuantity(n)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-10">
          <ReviewSection productId={productId} />
        </div>
      </div>
      <AlsoLike />
    </>
  );
}
