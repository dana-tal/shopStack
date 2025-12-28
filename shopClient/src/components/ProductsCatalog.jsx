import { useState, useEffect } from "react";
import { requestProductsPage } from "../utils/productRequests";
import ProductsGrid from "./ProductsGrid";
import Paginator from "./Paginator";
import Loader from "./Loader";

const PAGE_SIZE = import.meta.env.VITE_PRODUCTS_PAGE_SIZE;

function ProductsCatalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  return <>
      { totalCount==0 && <Loader />}
      { totalCount >0 &&
          (<><ProductsGrid products={products} />
          <Paginator totalPages={pagesNum} page={currentPage} pageChangedHandler={pageHandler}/></>)
      }
  </>
}

export default ProductsCatalog;
