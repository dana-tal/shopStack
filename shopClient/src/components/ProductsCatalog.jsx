import { useState, useEffect } from "react";
import { requestProductsPage } from "../utils/productRequests";
import ProductsGrid from "./ProductsGrid";
import Paginator from "./Paginator";
import Loader from "./Loader";
import Filter from "./Filter";

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

      console.log("pageInfo:");
      console.log(pageInfo);

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
  <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <Filter handleParamsChange={onParamsChange} defaultPrice={40} />

    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minHeight: "60vh" }}>
      
      {isLoading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.6)", zIndex: 10 }}>
          <Loader />
        </div>
      )}

      {products.length > 0 ? (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <ProductsGrid products={products} />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h2>No products found</h2>
        </div>
      )}

      {totalCount > 0 && <Paginator totalPages={pagesNum} page={currentPage} pageChangedHandler={pageHandler} />}
    </div>
  </div>
);


}

export default ProductsCatalog;
