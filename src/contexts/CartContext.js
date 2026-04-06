import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    });

    // Sync xuống localStorage mỗi khi items thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    // Thêm sản phẩm / combo vào giỏ
    const addItem = useCallback((newItem) => {
        setItems((prev) => {
            // Tìm item giống hệt (cùng id + size + crust + toppings)
            const existingIndex = prev.findIndex(
                (item) =>
                    item.itemId === newItem.itemId &&
                    item.itemType === newItem.itemType &&
                    item.size === newItem.size &&
                    item.crust === newItem.crust &&
                    JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings),
            );

            if (existingIndex !== -1) {
                // Đã có → tăng số lượng
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
                };
                return updated;
            }

            // Chưa có → thêm mới với cartKey unique
            return [
                ...prev,
                {
                    ...newItem,
                    cartKey: `${newItem.itemId}-${newItem.size || ''}-${newItem.crust || ''}-${Date.now()}`,
                    quantity: newItem.quantity || 1,
                },
            ];
        });
    }, []);

    // Xóa 1 item khỏi giỏ theo cartKey
    const removeItem = useCallback((cartKey) => {
        setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
    }, []);

    // Thay đổi số lượng
    const updateQuantity = useCallback((cartKey, quantity) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
            return;
        }
        setItems((prev) => prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item)));
    }, []);

    // Xóa toàn bộ giỏ hàng
    const clearCart = useCallback(() => setItems([]), []);

    // Tính tổng — dùng useMemo để không tính lại mỗi render
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

    const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

    // Build payload để gửi lên POST /api/orders
    const buildOrderPayload = useCallback(
        ({ customerInfo, paymentMethod, orderType, notes }) => ({
            customerInfo,
            paymentMethod,
            orderType,
            notes,
            items: items.map((item) => ({
                itemType: item.itemType,
                itemId: item.itemId,
                itemModel: item.itemType === 'product' ? 'Product' : 'Combo',
                quantity: item.quantity,
                productDetails:
                    item.itemType === 'product'
                        ? {
                              size: item.size,
                              crust: item.crust,
                              toppings: item.toppings || [],
                              instructions: item.instructions,
                          }
                        : undefined,
                comboDetails: item.itemType === 'combo' ? { selectedItems: item.selectedItems || [] } : undefined,
            })),
        }),
        [items],
    );

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                buildOrderPayload,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart phải dùng trong CartProvider');
    return ctx;
}

export default CartContext;
