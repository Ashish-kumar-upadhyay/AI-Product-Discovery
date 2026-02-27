"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { askAI, fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [askQuery, setAskQuery] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiProducts, setAiProducts] = useState(null); // null = not asked yet

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoadingProducts(true);
        setProductsError("");
        const list = await fetchProducts();
        if (!ignore) setProducts(list);
      } catch (e) {
        if (!ignore) setProductsError(e?.message || "Failed to load products");
      } finally {
        if (!ignore) setLoadingProducts(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const isAIActive = aiProducts !== null;
  const listToShow = useMemo(
    () => (aiProducts !== null ? aiProducts : products),
    [aiProducts, products]
  );

  async function onAskSubmit(e) {
    e.preventDefault();
    const q = askQuery.trim();
    if (!q) return;

    setAskLoading(true);
    setAskError("");
    setAiSummary("");
    setAiProducts(null);

    try {
      const result = await askAI(q);
      setAiSummary(result.summary || "");
      setAiProducts(result.products || []);
    } catch (err) {
      setAskError(err?.message || "AI request failed");
    } finally {
      setAskLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>AI Product Discovery</h1>
            <p className={styles.subtitle}>
              Browse products or ask in natural language (e.g. “budget laptops”
              or “good for gaming”).
            </p>
          </div>
          <div className={styles.pillRow}>
            <span className={styles.pill}>Backend: http://localhost:5000</span>
            <span className={styles.pill}>Frontend: http://localhost:3000</span>
          </div>
        </header>

        <section className={styles.askSection}>
          <form className={styles.askForm} onSubmit={onAskSubmit}>
            <input
              className={styles.askInput}
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="Ask: budget laptops for students"
              aria-label="Ask AI about products"
            />
            <button className={styles.askButton} disabled={askLoading}>
              {askLoading ? "Asking..." : "Ask AI"}
            </button>
          </form>

          {askError ? <p className={styles.error}>{askError}</p> : null}

          {aiSummary ? (
            <div className={styles.summaryBox}>
              <div className={styles.summaryLabel}>AI summary</div>
              <div className={styles.summaryText}>{aiSummary}</div>
            </div>
          ) : null}

          {isAIActive ? (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setAiProducts(null);
                setAiSummary("");
                setAskError("");
              }}
            >
              Clear AI results (show all)
            </button>
          ) : null}
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>
              {isAIActive ? "AI matched products" : "All products"}
            </h2>
            {loadingProducts ? (
              <span className={styles.muted}>Loading…</span>
            ) : null}
          </div>

          {productsError ? <p className={styles.error}>{productsError}</p> : null}

          {!loadingProducts && listToShow.length === 0 ? (
            <p className={styles.muted}>No products found.</p>
          ) : null}

          <div className={styles.grid}>
            {listToShow.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
