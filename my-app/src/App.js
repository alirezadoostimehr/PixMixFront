import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const getFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      query: params.get('query') || 'dress',
      category: params.get('category') || '',
      brandName: params.get('brand_name') || '',
      status: params.get('status') || '',
      gender: params.get('gender') || '',
      priceFrom: params.get('price_from') ? parseFloat(params.get('price_from')) : 0,
      priceTo: params.get('price_to') ? parseFloat(params.get('price_to')) : 1000,
      region: params.get('region') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromUrl);
  const [stagedFilters, setStagedFilters] = useState(filters);
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (queryParamsString) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/search?${queryParamsString}`);
if (!response.ok) {
  throw new Error('Network response was not ok');
}
const data = await response.json();
setProductData(data.results);
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    setCategories(data.categories);
  } catch (error) {
    console.error(error);
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/brands`);
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    const data = await response.json();
    setBrands(data.brands);
  } catch (error) {
    console.error(error);
  }
};

const fetchStatuses = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/statuses`);
    if (!response.ok) {
      throw new Error('Failed to fetch statuses');
    }
    const data = await response.json();
    setStatuses(data.statuses);
  } catch (error) {
    console.error(error);
  }
};

const fetchGenders = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/genders`);
    if (!response.ok) {
      throw new Error('Failed to fetch genders');
    }
    const data = await response.json();
    setGenders(data.genders);
  } catch (error) {
    console.error(error);
  }
};

const fetchRegions = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/regions`);
    if (!response.ok) {
      throw new Error('Failed to fetch regions');
    }
    const data = await response.json();
    setRegions(data.regions);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchCategories();
  fetchBrands();
  fetchStatuses();
  fetchGenders();
  fetchRegions();
}, []);

useEffect(() => {
  const queryParams = new URLSearchParams({
    query: filters.query,
    ...(filters.category && { category: filters.category }),
    ...(filters.brandName && { brand_name: filters.brandName }),
    ...(filters.status && { status: filters.status }),
    ...(filters.gender && { gender: filters.gender }),
    ...(filters.priceFrom !== undefined && { price_from: filters.priceFrom }),
    ...(filters.priceTo !== undefined && { price_to: filters.priceTo }),
    ...(filters.region && { region: filters.region }),
  });

  window.history.replaceState(null, '', `?${queryParams}`);
  fetchData(queryParams.toString());
}, [filters]);

const applyFilters = () => {
  setFilters({ ...stagedFilters });
};

const updateStagedFilter = (key, value) => {
  setStagedFilters((prevFilters) => ({
    ...prevFilters,
    [key]: value,
  }));
};

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
    <div className="app">
      <div className="filter-section">
        <div className="filter-header">
          <h2>Filters</h2>
          <input
              type="text"
              className="search-query"
              value={stagedFilters.query}
              onChange={(e) => updateStagedFilter('query', e.target.value)}
              placeholder="Search..."
          />
        </div>
        <div className="filters">
          <div className="filter">
            <label>Category</label>
            <select
                value={stagedFilters.category}
                onChange={(e) => updateStagedFilter('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label>Brand Name</label>
            <select
                value={stagedFilters.brandName}
                onChange={(e) => updateStagedFilter('brandName', e.target.value)}
            >
              <option value="">Select a brand</option>
              {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label>Status</label>
            <select
                value={stagedFilters.status}
                onChange={(e) => updateStagedFilter('status', e.target.value)}
            >
              <option value="">Select a status</option>
              {statuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label>Gender</label>
            <select
                value={stagedFilters.gender}
                onChange={(e) => updateStagedFilter('gender', e.target.value)}
            >
              <option value="">Select a gender</option>
              {genders.map((gender, index) => (
                  <option key={index} value={gender}>
                    {gender}
                  </option>
              ))}
            </select>
          </div>
          <div className="filter price-slider">
            <label>Price Range: {stagedFilters.priceFrom} - {stagedFilters.priceTo}</label>
            <div className="slider-container">
              <input
                  type="range"
                  min="0"
                  max="1000"
                  value={stagedFilters.priceFrom}
                  onChange={(e) => updateStagedFilter('priceFrom', Math.min(Number(e.target.value), stagedFilters.priceTo - 1))}
                  className="thumb thumb-left"
              />
              <input
                  type="range"
                  min="0"
                  max="1000"
                  value={stagedFilters.priceTo}
                  onChange={(e) => updateStagedFilter('priceTo', Math.max(Number(e.target.value), stagedFilters.priceFrom + 1))}
                  className="thumb thumb-right"
              />
            </div>
          </div>
          <div className="filter">
            <label>Region</label>
            <select
                value={stagedFilters.region}
                onChange={(e) => updateStagedFilter('region', e.target.value)}
            >
              <option value="">Select a region</option>
              {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
              ))}
            </select>
          </div>
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>
      <div className="product-container">
        {productData.length > 0 ? productData.map((result, index) => {
          const product = result.payload;
          return (
              <div key={index} className="product-card">
                <img src={product.images[0]} alt={product.name} className="product-image" />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p className="product-price">
                  {product.currency} {product.current_price}
                  {product.off_percent > 0 && (
                      <>
                        <span className="product-old-price">{product.currency} {product.old_price}</span>
                        <span className="product-discount">({product.off_percent}% off)</span>
                      </>
                  )}
                </p>
                <div className="sizes">Sizes: {product.sizes.map((size, sIndex) => <span key={sIndex}>{size}</span>)}</div>
                <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
              </div>
          );
        }) : (
            <div>No Products Found</div>
        )}
      </div>
    </div>
);
};

export default App;

