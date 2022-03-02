import { AppMeta, Content } from "newt-client-js";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Cover } from "../components/Cover";
import { Layout } from "../components/Layout";
import { ArticleCard } from "../components/ArticleCard";
import { Article } from "../types/article";
import { Pagination } from "../components/Pagination";

export interface HomeProps {
  app: AppMeta;
  articles: (Content & Article)[];
  total: number;
  page?: number;
}

export function Home({ app, articles, total, page = 1 }: HomeProps) {
  return (
    <Layout app={app}>
      <Head>
        <title>{app?.name || app?.uid || ""}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {app.cover?.value && <Cover app={app} />}
      <div className={styles.Articles}>
        {articles.map((article) => (
          <ArticleCard article={article} key={article._id} />
        ))}
        <Pagination total={total} current={page} />
      </div>
    </Layout>
  );
}
