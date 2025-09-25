import { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Función para obtener emoji de vehículo basado en el nombre
  const getVehicleEmoji = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('moto') || nameLower.includes('motorcycle')) return '🏍️';
    if (nameLower.includes('camión') || nameLower.includes('truck')) return '🚛';
    if (nameLower.includes('suv') || nameLower.includes('4x4')) return '🚙';
    if (nameLower.includes('deportivo') || nameLower.includes('sport')) return '🏎️';
    if (nameLower.includes('sedan') || nameLower.includes('sedán')) return '🚗';
    if (nameLower.includes('pickup')) return '🛻';
    if (nameLower.includes('bus') || nameLower.includes('autobús')) return '🚌';
    return '🚗'; // Por defecto
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image && product.image !== 'imagen.jpg' ? (
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ fontSize: '4rem' }}>
            {getVehicleEmoji(product.name)}
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">
          {product.description || 'Vehículo en excelente estado, listo para estrenar.'}
        </p>
        
        <div className="product-price">
          {formatPrice(product.price)}
        </div>
        
        <button 
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              Agregando...
            </>
          ) : (
            <>
              🛒 Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;