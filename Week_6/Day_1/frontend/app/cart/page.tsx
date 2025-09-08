'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetOrderHistoryQuery,
  useCheckoutMutation,
  useGetProfileQuery,
} from '../../store/api';
import { getSocket } from '../../lib/socket';
import { useRouter } from 'next/navigation';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DELIVERY_FEE = 200;
const FIRST_ORDER_DISCOUNT_PERCENT = 20;

type PayChoice = 'money' | 'points';

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const { data: user } = useGetProfileQuery();
  const { data: orderHistory } = useGetOrderHistoryQuery();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const [promo, setPromo] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'money' | 'points' | 'hybrid'>('money');

  const [hybridChoices, setHybridChoices] = useState<Record<string, PayChoice>>({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('CART_UPDATED', () => refetch());
    socket.on('CART_CHANGED', () => refetch());

    return () => {
      socket.off('CART_UPDATED');
      socket.off('CART_CHANGED');
    };
  }, [refetch]);

  const items: any[] = cart?.items || [];
  const cartId = cart?._id;

  const paymentTypesInCart = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      const unitPoints =
        it.unitPointsPrice && it.unitPointsPrice > 0
          ? it.unitPointsPrice
          : it.product?.pointsPrice ?? 0;
      const inferred =
        it.product?.paymentType ?? (unitPoints > 0 ? 'points' : 'money');
      set.add(inferred);
    }
    return Array.from(set);
  }, [items]);

  const hasOnlyMoney = paymentTypesInCart.length === 1 && paymentTypesInCart[0] === 'money';
  const hasOnlyPoints = paymentTypesInCart.length === 1 && paymentTypesInCart[0] === 'points';
  const hasHybrid = paymentTypesInCart.includes('hybrid');
  const hasMixed = paymentTypesInCart.length > 1;

  useEffect(() => {
    if (hasHybrid || hasMixed) {
      setPaymentMethod('hybrid');
    } else if (hasOnlyPoints) {
      setPaymentMethod('points');
    } else {
      setPaymentMethod('money');
    }

    const initial: Record<string, PayChoice> = {};
    for (const it of items) {
      const productId = it.product?._id || it.product;
      const color = it.color || '';
      const size = it.size || '';
      const key = `${productId}-${color}-${size}`;
      const productPaymentType = it.product?.paymentType ?? (it.unitPointsPrice ? 'points' : 'money');
      if (productPaymentType === 'hybrid') {
        if (!initial[key]) initial[key] = 'money';
      }
    }
    setHybridChoices((prev) => ({ ...initial, ...prev }));
  }, [hasHybrid, hasMixed, hasOnlyMoney, hasOnlyPoints, items.length]);

  const keyForItem = (it: any) => {
    const productId = it.product?._id || it.product;
    const color = it.color || '';
    const size = it.size || '';
    return `${productId}-${color}-${size}`;
  };

  const { subtotalMoney, subtotalPoints } = useMemo(() => {
    let money = 0;
    let points = 0;
    for (const it of items) {
      const qty = it.quantity || 0;
      const unitMoney =
        it.unitPrice && it.unitPrice > 0
          ? it.unitPrice
          : it.product?.salePrice ?? it.product?.regularPrice ?? 0;
      const unitPoints =
        it.unitPointsPrice && it.unitPointsPrice > 0
          ? it.unitPointsPrice
          : it.product?.pointsPrice ?? 0;

      const productPaymentType = it.product?.paymentType ?? (unitPoints > 0 ? 'points' : 'money');

      if (productPaymentType === 'money') {
        money += unitMoney * qty;
      } else if (productPaymentType === 'points') {
        points += unitPoints * qty;
      } else if (productPaymentType === 'hybrid') {
        const key = keyForItem(it);
        const choice = hybridChoices[key] ?? 'money';
        if (choice === 'money') {
          money += unitMoney * qty;
        } else {
          points += unitPoints * qty;
        }
      } else {
        money += unitMoney * qty;
      }
    }
    return { subtotalMoney: money, subtotalPoints: points };
  }, [items, hybridChoices]);

  const isFirstPurchase =
    (orderHistory && Array.isArray(orderHistory) && orderHistory.length === 0) || false;

  const discountAmount =
    isFirstPurchase && subtotalMoney > 0
      ? Math.round(subtotalMoney * (FIRST_ORDER_DISCOUNT_PERCENT / 100))
      : 0;

  const totalMoney =
    items.length === 0 ? 0 : Math.max(0, subtotalMoney - discountAmount + DELIVERY_FEE);

  const handleQtyChange = async (item: any, newQty: number) => {
    if (!cartId) return;
    if (newQty <= 0) {
      await removeFromCart({
        productId: item.product?._id || item.product,
        body: { color: item.color, size: item.size },
      });
      return;
    }
    await updateCartItem({
      productId: item.product?._id || item.product,
      body: { quantity: newQty, color: item.color, size: item.size },
    });
  };

  const handleRemove = async (item: any) => {
    await removeFromCart({
      productId: item.product?._id || item.product,
      body: { color: item.color, size: item.size },
    });
  };

  const handleApplyPromo = async () => {
    setApplyingPromo(true);
    setTimeout(() => {
      setApplyingPromo(false);
      alert('Promo not implemented in backend');
    }, 600);
  };

  const handleCheckout = async () => {
    if (!cartId) return alert('Cart is empty');

    if (paymentMethod === 'points') {
      const userPoints = user?.loyaltyPoints ?? 0;
      if (userPoints < subtotalPoints) {
        return alert('Your loyalty points are insufficient to complete this order.');
      }
    }

    const hasPointsOnlyProducts = items.some(
      (it) => (it.product?.paymentType ?? (it.unitPointsPrice ? 'points' : 'money')) === 'points'
    );
    if (hasPointsOnlyProducts && paymentMethod === 'money') {
      return alert('This cart contains points-only products. Please pay with points or hybrid.');
    }

    if ((hasHybrid || hasMixed) && paymentMethod !== 'hybrid') {
      return alert('This cart requires hybrid payment method.');
    }

    const hybridSelections = Object.entries(hybridChoices).map(([key, method]) => {
      const productId = key.split('-')[0];
      return { productId, method };
    });

    try {
      await checkout({ cartId, body: { paymentMethod, hybridSelections } }).unwrap();
      alert('Checkout successful');
      refetch();
      router.push('/');
    } catch (e: any) {
      alert(e?.data?.message || 'Checkout failed');
    }
  };

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-6">Loading cart...</div>;
  }

  // **New total display logic**
  const getTotalDisplay = () => {
    if (paymentMethod === 'points') {
      return `PKR ${DELIVERY_FEE} + Points ${subtotalPoints}`;
    } else if (paymentMethod === 'hybrid') {
      const moneyTotal = subtotalMoney > 0 ? subtotalMoney + DELIVERY_FEE : DELIVERY_FEE;
      return subtotalPoints > 0
        ? `PKR ${moneyTotal} + Points ${subtotalPoints}`
        : `PKR ${moneyTotal}`;
    } else {
      return `PKR ${totalMoney}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Cart items */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          <div className="space-y-4">
            {items.length === 0 && (
              <div className="p-6 border rounded">Your cart is empty.</div>
            )}

            {items.map((it: any) => {
              const productId = it.product?._id || it.product;
              const productName = it.product?.name || 'Product';
              const img =
                it.product?.variants?.[0]?.images?.[0] || '/placeholder.png';
              const size = it.size || '-';
              const color = it.color || '-';
              const qty = it.quantity || 1;

              const unitPrice =
                it.unitPrice && it.unitPrice > 0
                  ? it.unitPrice
                  : it.product?.salePrice ?? it.product?.regularPrice ?? 0;

              const unitPoints =
                it.unitPointsPrice && it.unitPointsPrice > 0
                  ? it.unitPointsPrice
                  : it.product?.pointsPrice ?? 0;

              const type =
                it.product?.paymentType ?? (unitPoints > 0 ? 'points' : 'money');

              const isHybrid = type === 'hybrid';
              const itemKey = keyForItem(it);
              const hybridChoice = hybridChoices[itemKey] ?? 'money';

              return (
                <div
                  key={`${productId}-${color}-${size}`}
                  className="border rounded p-4 bg-white"
                >
                  <div className="flex gap-4">
                    <div className="w-28 h-28 bg-gray-100 overflow-hidden rounded">
                      <img src={img} alt={productName} className="object-cover w-full h-full" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{productName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Color: <span className="capitalize">{color}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Size: {size}
                          </div>
                          <div className="text-sm font-semibold mt-1">
                            {type === 'points' && <>Points {unitPoints}</>}
                            {type === 'money' && <>PKR {unitPrice}</>}
                            {type === 'hybrid' && (
                              <div>
                                <div>PKR {unitPrice}</div>
                                <div className="text-gray-600 text-sm">Points {unitPoints}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(it)}
                          className="text-xs text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-3 justify-end">
                        <button
                          onClick={() => handleQtyChange(it, Math.max(0, qty - 1))}
                          className="w-8 h-8 border rounded"
                        >
                          -
                        </button>
                        <div className="w-10 text-center">{qty}</div>
                        <button
                          onClick={() => handleQtyChange(it, qty + 1)}
                          className="w-8 h-8 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {isHybrid && (
                        <div className="mt-3 flex items-center gap-3 justify-end">
                          <div className="text-sm mr-2">Pay with:</div>
                          <button
                            onClick={() =>
                              setHybridChoices((prev) => ({ ...prev, [itemKey]: 'money' }))
                            }
                            className={`px-2 py-1 border rounded ${hybridChoice === 'money' ? 'bg-gray-200' : ''}`}
                          >
                            Money
                          </button>
                          <button
                            onClick={() =>
                              setHybridChoices((prev) => ({ ...prev, [itemKey]: 'points' }))
                            }
                            className={`px-2 py-1 border rounded ${hybridChoice === 'points' ? 'bg-gray-200' : ''}`}
                          >
                            Points
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Order summary */}
        <aside>
          <div className="border rounded p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-600">Your available points</div>
              <div className="font-medium">{user?.loyaltyPoints ?? 0}</div>
            </div>

            <div className="flex justify-between mb-2 text-gray-600">
              <div className="text-sm">Subtotal</div>
              <div className="font-medium">PKR {subtotalMoney}</div>
            </div>

            {subtotalPoints > 0 && (
              <div className="flex justify-between mb-2 text-gray-600">
                <div className="text-sm">Points subtotal</div>
                <div className="font-medium">Points {subtotalPoints}</div>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between  mb-2">
                <div className="text-sm text-gray-600">Discount (-20%)</div>
                <div className="font-medium text-red-600">- PKR {discountAmount}</div>
              </div>
            )}

            <div className="flex justify-between mb-3 text-gray-600">
              <div className="text-sm">Delivery fee</div>
              <div className="font-medium">
                PKR {items.length === 0 ? 0 : DELIVERY_FEE}
              </div>
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between items-center">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-lg font-semibold">{getTotalDisplay()}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Add promo code"
                className="border p-2 rounded"
              />
              <button
                onClick={handleApplyPromo}
                disabled={applyingPromo}
                className="bg-gray-800 text-white px-3 rounded"
              >
                {applyingPromo ? 'Applying...' : 'Apply'}
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm block mb-1">Payment method</label>
              <div className="flex gap-2">
                <label
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    paymentMethod === 'money' ? 'bg-gray-200' : ''
                  } ${hasOnlyPoints || hasHybrid || hasMixed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="money"
                    checked={paymentMethod === 'money'}
                    onChange={() => {
                      if (!hasOnlyPoints && !hasHybrid && !hasMixed) setPaymentMethod('money');
                    }}
                    className="hidden"
                    disabled={hasOnlyPoints || hasHybrid || hasMixed}
                  />
                  Money
                </label>

                <label
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    paymentMethod === 'points' ? 'bg-gray-200' : ''
                  } ${hasOnlyMoney || hasHybrid || hasMixed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="points"
                    checked={paymentMethod === 'points'}
                    onChange={() => {
                      if (!hasOnlyMoney && !hasHybrid && !hasMixed) setPaymentMethod('points');
                    }}
                    className="hidden"
                    disabled={hasOnlyMoney || hasHybrid || hasMixed}
                  />
                  Points
                </label>

                <label
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    paymentMethod === 'hybrid' ? 'bg-gray-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="hybrid"
                    checked={paymentMethod === 'hybrid'}
                    onChange={() => setPaymentMethod('hybrid')}
                    className="hidden"
                  />
                  Hybrid
                </label>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || isCheckingOut}
              className="mt-6 w-full bg-black text-white py-3 rounded disabled:opacity-60"
            >
              {isCheckingOut ? 'Processing...' : 'Go to Checkout'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
