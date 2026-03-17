import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api/index.js';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import './ProductsPage.css';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const [field, order] = sortBy.split('_');
    try {
      const { data } = await productAPI.getAll({
        keyword,
        category: categoryId,
        sortBy: field,
        order,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        page,
        limit: 12,
      });
      setProducts(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, sortBy, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.data || []));
  }, []);

  const applyFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value;
    else delete params[key];
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt_desc');
    setPage(1);
  };

  return (
    <div className="products-page">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="products-toolbar">
        <div className="toolbar-left">
          <h1 className="products-heading">
            {keyword ? `Results for "${keyword}"` : 'All Products'}
          </h1>
          <span className="products-count">{total} items</span>
        </div>
        <div className="toolbar-right">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            className="filter-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="products-layout">
        {/* ── Sidebar Filters ─────────────────────────────────── */}
        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>
              <FiX /> Clear
            </button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="category-list">
              <button
                className={`cat-chip ${!categoryId ? 'active' : ''}`}
                onClick={() => applyFilter('category', '')}
              >All</button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  className={`cat-chip ${categoryId === c._id ? 'active' : ''}`}
                  onClick={() => applyFilter('category', c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
                min="0"
              />
              <span className="price-sep">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
                min="0"
              />
            </div>
            <button className="apply-price-btn" onClick={fetchProducts}>Apply</button>
          </div>
        </aside>

        {/* ── Products ─────────────────────────────────────────── */}
        <div className="products-main">
          {loading ? (
            <div className="grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >← Prev</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                  >Next →</button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p className="no-results-emoji">🔍</p>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="clear-btn-lg" onClick={clearFilters}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
