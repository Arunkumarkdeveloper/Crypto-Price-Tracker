import Image from "next/image";

export default function Search({ value, onChange, handleSearch }) {
  return (
    <>
      <i className="icon-class">
        <Image
          src="/images/search.png"
          width={20}
          height={20}
          alt=""
          className="text-center"
        />
      </i>
      <input
        placeholder="Search Coins"
        className="input-field"
        style={{ fontSize: "12.5px" }}
        type="search"
        name="query"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
    </>
  );
}
