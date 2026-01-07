import { useState, useEffect } from "react";
import { requestProductsPage } from "../utils/productRequests";
import ProductsGrid from "./ProductsGrid";
import Paginator from "./Paginator";
import Loader from "./Loader";
import Filter from "./Filter";
import Cart from "./Cart";

const PAGE_SIZE = import.meta.env.VITE_PRODUCTS_PAGE_SIZE;

function ProductsCatalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const pagesNum = Math.ceil(totalCount / PAGE_SIZE);

  const pageHandler = (pageNum)=>{
       setCurrentPage(pageNum);
  }


  const fetchProductsPage = async (filters=null) => {
      setIsLoading(true);
      const pageInfo = await requestProductsPage(currentPage, PAGE_SIZE,filters);

    
      if (pageInfo.ok) {
        setProducts(pageInfo.data.products);
        setTotalCount(pageInfo.data.totalItems);
      } else {
        setError(pageInfo.message);
      }
      setIsLoading(false);
    };

  useEffect(() => {
    
    fetchProductsPage();
  }, [currentPage]);

  const onParamsChange = (filterObj) =>{

    console.log("Filters changed:", filterObj);
    setCurrentPage(1);
    fetchProductsPage(filterObj); 
  }

return (
 

  <div style={{flexGrow: 1, display: "flex", flexDirection: "column" }}>
    <Filter handleParamsChange={onParamsChange} defaultPrice={40} />

   <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
  {isLoading && (
    <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.6)", zIndex: 10 }}>
      <Loader />
    </div>
  )}

  {products.length > 0 ? (
    <div style={{ overflowY: "auto", flexGrow: 0 }}
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",
      sm: "repeat(3, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
    minHeight: (theme) => {
      // Calculate minHeight based on PAGE_SIZE
      // Each card is square, width determined by grid column
      const columns = 4; // max columns on md screens
      const rows = Math.ceil(PAGE_SIZE / columns);
      return `calc(${rows} * (200px + ${theme.spacing(2)}))`; 
      // 200px = approximate card width, theme.spacing(2) = grid gap
    },
  }}>
      <ProductsGrid products={products} />
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h2>No products found</h2>
    </div>
  )}

  {totalCount > 0 && (
    <div style={{ marginTop: "8px" }}>
      <Paginator totalPages={pagesNum} page={currentPage} pageChangedHandler={pageHandler} />
    </div>
  )}
</div>

    <Cart />
  </div>
 
);


}

export default ProductsCatalog;
