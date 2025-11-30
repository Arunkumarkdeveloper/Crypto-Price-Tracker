import ReactPaginate from "react-paginate";

export default function PaginatedItems({ total, pagination, setPagination }) {
  const itemsPerPage = pagination?.limit;
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setPagination({ ...pagination, ["page"]: selectedPage });
  };

  return (
    <div className="pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
        activeClassName="active-pagination"
        containerClassName="react-paginate"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        disabledClassName="disabled"
      />
    </div>
  );
}
