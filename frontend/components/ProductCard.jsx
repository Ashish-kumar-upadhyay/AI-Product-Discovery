import styles from "./ProductCard.module.css";

function formatPrice(price) {
  if (typeof price !== "number") return String(price ?? "");
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <h3 className={styles.title}>{product.name}</h3>
        <span className={styles.price}>{formatPrice(product.price)}</span>
      </div>

      <p className={styles.description}>{product.description}</p>

      <div className={styles.metaRow}>
        <span className={styles.badge}>{product.category}</span>
        {Array.isArray(product.tags) && product.tags.length > 0 ? (
          <div className={styles.tags}>
            {product.tags.slice(0, 4).map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

