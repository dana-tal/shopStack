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

  useEffect(() => {
    const fetchProductsPage = async () => {
      setIsLoading(true);
      const pageInfo = await requestProductsPage(currentPage, PAGE_SIZE);

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
    fetchProductsPage();
  }, [currentPage]);

  const onParamsChange = (filterObj) =>{

          console.log("###############");
           console.log("catId:", filterObj.catId);
           console.log("price", filterObj.price);
           console.log("name",filterObj.name);
  }

  return <>
      { isLoading && <Loader />}
      { totalCount >0 &&
          (<>
          <Filter handleParamsChange={onParamsChange} defaultPrice={40}/>
          <ProductsGrid products={products} />
          <Paginator totalPages={pagesNum} page={currentPage} pageChangedHandler={pageHandler}/></>)
      }
      { totalCount===0 && <div style={{ display:"flex", justifyContent:"center"}}><h2>No products found</h2></div>}
  </>
}

export default ProductsCatalog;
