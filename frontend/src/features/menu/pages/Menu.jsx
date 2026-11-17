import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import ProductList from '@/features/products/components/ProductList';
import { useProducts } from '@/features/products/hooks/useProducts';
import '../css/Menu.css';

const normalizeText = (value = '') =>
  String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const getCategory = (product) =>
  product?.category?.name || product?.category || product?.category_name || 'Outros sabores';

export default function Menu() {
  const { products, loading, error } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(() => {
    const available = [...new Set(products.map(getCategory).filter(Boolean))];
    return ['Todos', ...available.sort((a, b) => a.localeCompare(b, 'pt-BR'))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'Todos' || getCategory(product) === category;
      const searchableText = normalizeText(`${product?.name || ''} ${product?.description || ''}`);
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price) - Number(b.price);
      if (sort === 'price-desc') return Number(b.price) - Number(a.price);
      if (sort === 'name') return String(a.name).localeCompare(String(b.name), 'pt-BR');
      return 0;
    });
  }, [products, query, category, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('Todos');
    setSort('featured');
  };

  const hasFilters = query || category !== 'Todos' || sort !== 'featured';

  return (
    <main className="menu-page" id="main-content">
      <section className="menu-hero" aria-labelledby="menu-title">
        <div className="menu-hero__orb menu-hero__orb--one" aria-hidden="true" />
        <div className="menu-hero__orb menu-hero__orb--two" aria-hidden="true" />
        <div className="menu-hero__content">
          <span className="menu-eyebrow"><Sparkles size={14} /> Nosso cardápio</span>
          <h1 id="menu-title">Escolha o sabor.<br /><em>A gente cria a memória.</em></h1>
          <p>Descubra receitas artesanais para celebrar do seu jeito. Cada bolo pode ganhar cores, detalhes e acabamentos pensados especialmente para você.</p>
        </div>
        <div className="menu-hero__note" aria-hidden="true">
          <span>feito à mão</span>
          <i>com afeto</i>
        </div>
      </section>

      <section className="menu-catalog" aria-labelledby="catalog-title">
        <div className="menu-toolbar">
          <div className="menu-toolbar__heading">
            <span className="menu-toolbar__icon"><SlidersHorizontal size={18} /></span>
            <div>
              <span>Explore a vitrine</span>
              <h2 id="catalog-title">Todos os sabores</h2>
            </div>
          </div>

          <label className="menu-search">
            <span className="sr-only">Buscar no cardápio</span>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar bolo ou sabor..."
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X size={16} /></button>}
          </label>

          <label className="menu-sort">
            <span>Ordenar</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome de A–Z</option>
            </select>
          </label>
        </div>

        {categories.length > 1 && (
          <div className="menu-categories" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="menu-results-meta" aria-live="polite">
            <p><strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? 'delícia encontrada' : 'delícias encontradas'}</p>
            {hasFilters && <button type="button" onClick={resetFilters}>Limpar filtros <X size={14} /></button>}
          </div>
        )}

        {loading && (
          <div className="menu-loading" aria-label="Carregando produtos">
            {[1, 2, 3].map((item) => <span key={item} />)}
          </div>
        )}

        {error && !loading && (
          <div className="menu-empty"><span>Ops!</span><h2>A vitrine não carregou.</h2><p>Tente novamente em alguns instantes.</p></div>
        )}

        {!loading && !error && visibleProducts.length > 0 && <ProductList products={visibleProducts} />}

        {!loading && !error && visibleProducts.length === 0 && (
          <div className="menu-empty"><span>Nenhum resultado</span><h2>Que tal provar outra busca?</h2><p>Experimente outro nome ou limpe os filtros para ver todo o cardápio.</p><button type="button" onClick={resetFilters}>Ver todos os sabores</button></div>
        )}
      </section>
    </main>
  );
}
