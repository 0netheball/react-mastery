import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Header } from '../../components/Header';
import { formatCurrency } from '../../utils/money';
import './SellerPage.css';

export function SellerPage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [keywords, setKeywords] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef(null);

  const loadProducts = async () => {
    try {
      const res = await axios.get('/api/my-products');
      setProducts(res.data);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('1');
    setKeywords('');
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('priceCents', String(Math.round(parseFloat(price) * 100)));
      formData.append('quantity', quantity);
      formData.append('keywords', keywords);
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }

      resetForm();
      await loadProducts();
    } catch (e) {
      console.error('Failed to save product', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(String(product.priceCents / 100));
    setQuantity(String(product.quantity));
    setKeywords(product.keywords?.filter(Boolean).join(', ') || '');
    setImagePreview(null);
    setImageFile(null);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  return (
    <>
      <title>Мои товары</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.png" />
      <Header cart={cart} />
      <div className="seller-page">
        <div className="seller-form-panel">
          <h2 className="seller-title">{editingId ? 'Редактировать товар' : 'Добавить товар'}</h2>
          <form className="seller-form" onSubmit={handleSubmit}>
            <div className="seller-form-group">
              <label>Фото товара</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} />
              {(imagePreview || (editingId && products.find(p => p.id === editingId)?.image)) && (
                <img
                  className="seller-form-preview"
                  src={imagePreview || `/${products.find(p => p.id === editingId).image}`}
                  alt="preview"
                />
              )}
            </div>
            <div className="seller-form-group">
              <label>Название</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="seller-form-group">
              <label>Цена (₽)</label>
              <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="seller-form-group">
              <label>Количество</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div className="seller-form-group">
              <label>Ключевые слова (через запятую)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="gpu, видеокарта, nvidia" />
            </div>
            <div className="seller-form-actions">
              <button className="seller-form-submit" type="submit" disabled={submitting}>
                {submitting ? 'Сохранение...' : editingId ? 'Сохранить' : 'Добавить'}
              </button>
              {editingId && (
                <button className="seller-form-cancel" type="button" onClick={resetForm}>Отмена</button>
              )}
            </div>
          </form>
        </div>
        <div className="seller-list-panel">
          <h2 className="seller-title">Мои товары</h2>
          {loading ? (
            <div className="seller-loading">Загрузка...</div>
          ) : products.length === 0 ? (
            <div className="seller-empty">У вас ещё нет товаров</div>
          ) : (
            <div className="seller-list">
              {products.map(product => (
                <div key={product.id} className="seller-card">
                  <img className="seller-card-img" src={`/${product.image}`} alt={product.name} />
                  <div className="seller-card-info">
                    <div className="seller-card-name">{product.name}</div>
                    <div className="seller-card-price">{formatCurrency(product.priceCents)}</div>
                    <div className="seller-card-meta">В наличии: {product.quantity} шт.</div>
                    <div className="seller-card-keywords">
                      {product.keywords?.filter(Boolean).join(', ') || '—'}
                    </div>
                  </div>
                  <div className="seller-card-actions">
                    <button className="seller-card-edit" title="Редактировать" onClick={() => handleEdit(product)}>✎</button>
                    <button className="seller-card-delete" title="Удалить" onClick={() => handleDelete(product.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
