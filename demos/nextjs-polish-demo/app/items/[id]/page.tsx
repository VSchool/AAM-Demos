import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, getItems } from "@/lib/items";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getItems().map((item) => ({ id: item.id }));
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params;
  const item = getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Link href="/items" className="detail-back">
        &larr; Back to items
      </Link>

      <div className="detail-card">
        <div className="detail-top">
          <h1 className="detail-name">{item.name}</h1>
          <span className="detail-price">${item.price}</span>
        </div>

        <div className="detail-meta">
          <span className="item-card-category">{item.category}</span>
          <span
            className="stock-badge"
            data-stock={item.inStock.toString()}
          >
            {item.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <p className="detail-desc">{item.description}</p>

        <h2 className="detail-section-title">Details</h2>
        <ul className="detail-specs">
          <li className="detail-spec">
            <span className="detail-spec-label">Product ID</span>
            <span>{item.id}</span>
          </li>
          <li className="detail-spec">
            <span className="detail-spec-label">Category</span>
            <span>{item.category}</span>
          </li>
          <li className="detail-spec">
            <span className="detail-spec-label">Price</span>
            <span>${item.price}</span>
          </li>
          <li className="detail-spec">
            <span className="detail-spec-label">Availability</span>
            <span>{item.inStock ? "Available" : "Backordered"}</span>
          </li>
        </ul>
      </div>
    </>
  );
}
