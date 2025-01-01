"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/secondheader";
import { FaHeart, FaShareAlt, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/store/features/cart";
import { AppDispatch } from "@/app/store/store";
import { toast } from "react-toastify";

// Define the Product interface
interface Product {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price: number; // Price is now a number
  strInstructions: string;
}

// Define the type for the API response item
interface ApiMealItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const { shopdetail } = useParams();
  const [isReadMore, setIsReadMore] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Fetch product detail based on product ID
  useEffect(() => {
    if (typeof shopdetail === "string") {
      fetchProductDetail(shopdetail);
      fetchSimilarProducts();
    }
  }, [shopdetail]);

  // Fetch product details from the API
  const fetchProductDetail = async (id: string) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    if (data.meals) {
      const productData = data.meals[0];
      setProduct({
        idMeal: productData.idMeal,
        strMeal: productData.strMeal,
        strMealThumb: productData.strMealThumb,
        price: 19.99, // Set price as a number
        strInstructions: productData.strInstructions,
      });
    }
  };

  // Fetch similar products from the API
  const fetchSimilarProducts = async () => {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=b");
    const data = await res.json();
    if (data.meals) {
      const similarProductsData = data.meals.slice(0, 4).map((item: ApiMealItem) => ({
        idMeal: item.idMeal,
        strMeal: item.strMeal,
        strMealThumb: item.strMealThumb,
        price: 19.99, // Set price as a number
        strInstructions: item.strInstructions,
      }));
      setSimilarProducts(similarProductsData);
    }
  };

  // Handle quantity increment
  const handleIncrement = () => setQuantity(quantity + 1);

  // Handle quantity decrement
  const handleDecrement = () =>
    setQuantity(quantity > 1 ? quantity - 1 : 1);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          idMeal: product.idMeal,
          strMeal: product.strMeal,
          strMealThumb: product.strMealThumb,
          price: product.price,
          quantity,
        })
      );
      toast.success(`${product.strMeal} has been added to the cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/shopcart');
    }
  };

  // Loading state while fetching product details
  if (!product) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <section className="w-full signup-bg-image py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white font-bold text-center mb-6">
              Shop Detail
            </h1>
            <div className="text-base sm:text-lg md:text-xl flex gap-2 text-center justify-center">
              <Link href="/" className="text-white hover:text-[#FF9F0D] transition-colors duration-300">
                Home
              </Link>
              <span className="text-white">/</span>
              <Link href="/menu" className="text-[#FF9F0D]">
                Detail
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-screen bg-gray-50 py-12 px-4 lg:px-16">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-7">
            {/* Image Section */}
            <div className="lg:w-1/2 w-full">
              <Image
                src={product.strMealThumb}
                alt={product.strMeal}
                width={500}
                height={500}
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* Thumbnails Section */}
            <div className="hidden lg:flex lg:w-1/7 flex-col gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-[150px] rounded-md overflow-hidden"
                >
                  <Image
                    src={product.strMealThumb}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={500}
                    className="w-[150px] h-[134px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 w-full flex flex-col">
              <div className="h-fit flex flex-col">
                <h1 className="text-4xl font-bold text-gray-800">{product.strMeal}</h1>
                {/* Description with Read More/Read Less */}
                <div className="mt-4">
                  <p className={`text-gray-600 ${isReadMore ? "" : "line-clamp-[7]"}`}>
                    {product.strInstructions}
                  </p>
                  <button
                    className="text-[#FF9F0D] font-semibold mt-2"
                    onClick={() => setIsReadMore(!isReadMore)}
                  >
                    {isReadMore ? "Read Less" : "Read More"}
                  </button>
                </div>
                <p className="text-3xl font-semibold text-gray-800 mt-6">${product.price}</p>
                <div className="flex items-center mt-4">
                  <span className="text-[#FF9F0D] text-xl mr-2">★★★★★</span>
                  <p className="text-gray-600">5.0 Rating | 22 Reviews</p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-4">
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>
                <button
                  className="w-full py-3 bg-[#FF9F0D] text-white font-bold rounded-md hover:bg-[#FF9F0D]"
                  onClick={handleAddToCart}
                >
                  Add to Cart <FaShoppingCart className="inline ml-2" />
                </button>
                <button
                  className="w-full py-3 bg-[#FF9F0D] text-white font-bold rounded-md hover:bg-[#FF9F0D] mt-4"
                  onClick={() => router.push('/shop')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Similar Food Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Similar Food Item</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <div
                  key={product.idMeal}
                  className="bg-white rounded-md shadow-md overflow-hidden group relative"
                >
                  {/* Main Image */}
                  <Image
                    src={product.strMealThumb}
                    alt={product.strMeal}
                    className="w-full h-50 object-cover"
                    width={300}
                    height={300}
                  />

                  {/* Hover Overlay with Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href="#"
                      className="text-white bg-gray-800 p-2 rounded-full hover:bg-[#FF9F0D]"
                    >
                      <FaShareAlt />
                    </Link>
                    <Link
                    href={`/shop/${product.idMeal}`}
                    className="text-[#FF9F0D] bg-gray-800 p-2 rounded-full hover:bg-[#FF9F0D] hover:text-black"
                  >
                    <FaShoppingCart />
                  </Link>
                    <Link
                      href="#"
                      className="text-white bg-gray-800 p-2 rounded-full hover:bg-[#FF9F0D]"
                    >
                      <FaHeart />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.strMeal}</h3>
                    <p className="text-gray-600">{`$${product.price}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
