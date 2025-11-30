import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center mt-100 mb-100">
      <h2 className="color-gold mb-10">Page Not Found</h2>
      <p>Could not find requested resource</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link href="/">
          <button className="btn btn-main mt-15">Return Home</button>
        </Link>
      </div>
    </div>
  );
}
