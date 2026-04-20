import React, {useState, useEffect} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import productService from '../../services/product.service.ts';
import brandService from '../../services/brand.service.ts';
import Pagination from '../../components/Pagination';
import PriceFilter from '../../components/PriceFilter';
import BrandFilter from '../../components/BrandFilter';
import ConnectionTypeFilter from '../../components/ConnectionTypeFilter';
import SensorTypeFilter from '../../components/SensorTypeFilter';
import WirelessFilter from '../../components/WirelessFilter';
import DPIFilter from '../../components/DPIFilter';
import ProductCard from '../../components/ProductCard';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../../contexts/LoginRegisterModalContext.jsx";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type ProductSummary, ConnectionType, SensorType} from "../../types/product.types.js";
import {type Brand} from "../../types/brand.types.js";

interface ExpandedFilters {
    price: boolean;
    brand: boolean;
    connectionType: boolean;
    sensorType: boolean;
    wireless: boolean;
    dpi: boolean;
}

interface Range {
    min: number;
    max: number;
}

const ProductPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [priceRange, setPriceRange] = useState<Range>({min: 0, max: 1000});
    const [dpiRange, setDpiRange] = useState<Range>({min: 1000, max: 36000});

    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    const [expandedFilters, setExpandedFilters] = useState<ExpandedFilters>({
        price: true,
        brand: true,
        connectionType: true,
        sensorType: true,
        wireless: true,
        dpi: true
    });
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const currentPage = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('size') || '9');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDir = searchParams.get('sortDir') || 'asc';
    const selectedBrandNames = searchParams.get('brandNames') ?
        searchParams.get('brandNames')!.split(',') : [];

    const wirelessParam = searchParams.get('wireless');
    const selectedWireless: boolean | null =
        wirelessParam === 'true' ? true : wirelessParam === 'false' ? false : null;

    const connectionTypeParam = searchParams.get('connectionType');
    const selectedConnectionTypes: ConnectionType[] = connectionTypeParam
        ? connectionTypeParam.split(',').filter(ct =>
            Object.values(ConnectionType).includes(ct as ConnectionType)
        ) as ConnectionType[]
        : [];

    const sensorTypeParam = searchParams.get('sensorType');
    const selectedSensorTypes: SensorType[] = sensorTypeParam
        ? sensorTypeParam.split(',').filter(st =>
            Object.values(SensorType).includes(st as SensorType)
        ) as SensorType[]
        : [];

    const minPrice = parseFloat(searchParams.get('minPrice') || String(priceRange.min));
    const maxPrice = parseFloat(searchParams.get('maxPrice') || String(priceRange.max));
    const minDpi = parseInt(searchParams.get('minDpi') || String(dpiRange.min));
    const maxDpi = parseInt(searchParams.get('maxDpi') || String(dpiRange.max));

    const getSortDisplay = (): string => {
        if (sortBy === 'price' && sortDir === 'asc') return 'Price: Low to High';
        if (sortBy === 'price' && sortDir === 'desc') return 'Price: High to Low';
        if (sortBy === 'name' && sortDir === 'asc') return 'Name: A to Z';
        if (sortBy === 'name' && sortDir === 'desc') return 'Name: Z to A';
        return 'Default';
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                const productsResponse = await productService.getProducts({
                    page: currentPage - 1,
                    size: pageSize,
                    sortBy,
                    sortDir: sortDir as 'asc' | 'desc',
                    brandNames: selectedBrandNames.length > 0 ? selectedBrandNames : undefined,
                    wireless: selectedWireless !== null ? selectedWireless : undefined,
                    connectionType: selectedConnectionTypes.length > 0 ? selectedConnectionTypes[0] : undefined,
                    sensorType: selectedSensorTypes.length > 0 ? selectedSensorTypes[0] : undefined,
                    minPrice: parseFloat(searchParams.get('minPrice') || String(priceRange.min)),
                    maxPrice: parseFloat(searchParams.get('maxPrice') || String(priceRange.max)),
                    minDpi: minDpi || undefined,
                    maxDpi: maxDpi || undefined
                });

                setProducts(productsResponse.content);
                setTotalPages(productsResponse.totalPages);
                setTotalElements(productsResponse.totalElements);

                const allProducts = await productService.getProducts({size: 1000});
                const prices = allProducts.content.map(product => product.price);
                setPriceRange({min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices))});

                const dpis = allProducts.content.map(product => product.dpi);
                setDpiRange({min: Math.floor(Math.min(...dpis)), max: Math.ceil(Math.max(...dpis))});

                const brandsResponse = await brandService.getAllBrands();
                setBrands(brandsResponse);

            } catch (error) {
                const apiError = parseApiError(error, 'Failed to load products');
                toast.error(getErrorMessage(apiError));
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [searchParams]);

    const toggleFilter = (filterName: keyof ExpandedFilters) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const updateFilters = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === null || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }

        if (key !== 'page') {
            newParams.set('page', '1');
        }

        setSearchParams(newParams);
    };

    const updatePriceFilter = (minPrice: number, maxPrice: number) => {
        const newParams = new URLSearchParams(searchParams);

        newParams.set('minPrice', String(minPrice));
        newParams.set('maxPrice', String(maxPrice));
        newParams.set('page', '1');

        setSearchParams(newParams);
    };

    const updateDPIFilter = (minDpi: number, maxDpi: number) => {
        const newParams = new URLSearchParams(searchParams);

        newParams.set('minDpi', String(minDpi));
        newParams.set('maxDpi', String(maxDpi));
        newParams.set('page', '1');

        setSearchParams(newParams);
    };

    const handleSortChange = (sortValue: string) => {
        const newParams = new URLSearchParams(searchParams);

        if (sortValue === 'price_asc') {
            newParams.set('sortBy', 'price');
            newParams.set('sortDir', 'asc');
        } else if (sortValue === 'price_desc') {
            newParams.set('sortBy', 'price');
            newParams.set('sortDir', 'desc');
        } else if (sortValue === 'name_asc') {
            newParams.set('sortBy', 'name');
            newParams.set('sortDir', 'asc');
        } else if (sortValue === 'name_desc') {
            newParams.set('sortBy', 'name');
            newParams.set('sortDir', 'desc');
        } else {
            newParams.delete('sortBy');
            newParams.delete('sortDir');
        }

        setSearchParams(newParams);
        setSortDropdownOpen(false);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        updateFilters('page', newPage.toString());
        window.scrollTo(0, 0);
    };

    const clearAllFilters = () => {
        navigate('/products?page=1');
    };

    const handleAddToCart = async (productId: string) => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: productId,
                    quantity: 1
                });
                toast.success('Product added to cart successfully!');
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to add product to cart');
                toast.error(getErrorMessage(apiError));
            }
        } else {
            openModal();
        }
    };

    return (
        <>
            <Header/>

            <section className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb Path */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">Products</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mb-10 relative">
                    {/* Filters Heading */}
                    <div className="relative h-10">
                        <div className="absolute bottom-0 left-0">
                            <h3 className="text-xl text-gray-800">Filters</h3>
                        </div>
                        <div className="absolute bottom-0 right-0">
                            <button
                                onClick={clearAllFilters}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex justify-end items-center gap-2 font-sans">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <div className="relative inline-block w-48">
                            <div
                                className="w-full py-2 px-3 bg-white border border-gray-300 rounded flex justify-between items-center cursor-pointer text-sm hover:border-gray-400 transition-colors"
                                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                            >
                                <span>{getSortDisplay()}</span>
                                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${sortDropdownOpen ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
                            </div>
                            {sortDropdownOpen && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded z-50 shadow-lg">
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100 rounded-t"
                                        onClick={() => handleSortChange('')}
                                    >
                                        Default
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('price_asc')}
                                    >
                                        Price: Low to High
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('price_desc')}
                                    >
                                        Price: High to Low
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('name_asc')}
                                    >
                                        Name: A to Z
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100 rounded-b"
                                        onClick={() => handleSortChange('name_desc')}
                                    >
                                        Name: Z to A
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="rounded-2xl p-5 h-fit w-full border border-gray-200 shadow-sm">
                        <div className="w-full space-y-4">
                            {/* Price Filter */}
                            <PriceFilter
                                expanded={expandedFilters.price}
                                toggleFilter={() => toggleFilter('price')}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                priceRange={priceRange}
                                updateFilters={updatePriceFilter}
                            />

                            {/* Brand Filter */}
                            <BrandFilter
                                expanded={expandedFilters.brand}
                                toggleFilter={() => toggleFilter('brand')}
                                brands={brands}
                                selectedBrandNames={selectedBrandNames}
                                updateFilters={updateFilters}
                            />

                            {/* Wireless Filter */}
                            <WirelessFilter
                                expanded={expandedFilters.wireless}
                                toggleFilter={() => toggleFilter('wireless')}
                                selectedWireless={selectedWireless}
                                updateFilters={updateFilters}
                            />

                            {/* Connection Type Filter */}
                            <ConnectionTypeFilter
                                expanded={expandedFilters.connectionType}
                                toggleFilter={() => toggleFilter('connectionType')}
                                selectedConnectionTypes={selectedConnectionTypes}
                                updateFilters={updateFilters}
                            />

                            {/* Sensor Type Filter */}
                            <SensorTypeFilter
                                expanded={expandedFilters.sensorType}
                                toggleFilter={() => toggleFilter('sensorType')}
                                selectedSensorTypes={selectedSensorTypes}
                                updateFilters={updateFilters}
                            />

                            {/* DPI Filter */}
                            <DPIFilter
                                expanded={expandedFilters.dpi}
                                toggleFilter={() => toggleFilter('dpi')}
                                minDpi={minDpi}
                                maxDpi={maxDpi}
                                dpiRange={dpiRange}
                                updateFilters={updateDPIFilter}
                            />
                        </div>
                    </div>

                    {/* Content - Products */}
                    <div className="w-full max-w-full px-5 pb-5">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <div className="ml-4 text-lg">Loading products...</div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Mice Found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 text-sm text-gray-600">
                                    Showing {totalElements} products
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={() => handleAddToCart(product.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div></div>

                    {/* Pagination */}
                    {!loading && products.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="mb-5"
                        />
                    )}
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default ProductPage;