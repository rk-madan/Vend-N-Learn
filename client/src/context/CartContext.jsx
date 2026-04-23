import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => React.useContext(CartContext);


export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('mern_cart')) || []);

    useEffect(() => {
        localStorage.setItem('mern_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        const discountedProduct = { ...product, price: Math.floor(product.price * 0.95) };
        setCart(prev => {
            const existing = prev.find(item => item.sku === product.sku);
            if (existing) {
                return prev.map(item => item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...discountedProduct, qty: 1 }];
        });
    };

    const removeFromCart = (sku) => {
        setCart(prev => prev.filter(item => item.sku !== sku));
    };

    const updateQty = (sku, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.sku === sku) {
                    return { ...item, qty: item.qty + delta };
                }
                return item;
            }).filter(item => item.qty > 0);
        });
    };

    const clearCart = () => setCart([]);

    const getCount = () => cart.reduce((acc, item) => acc + item.qty, 0);

    const getCountForProduct = (sku) => {
        const item = cart.find(i => i.sku === sku);
        return item ? item.qty : 0;
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, getCount, getCountForProduct }}>
            {children}
        </CartContext.Provider>
    );
};
