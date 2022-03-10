import { AppMeta, Content } from "newt-client-js";
import styles from "../../styles/Article.module.css";
import Head from "next/head";
import { useMemo } from "react";
import { Layout } from "../../components/Layout";
import { fetchApp, fetchArticles, fetchCurrentArticle } from "../../lib/api";
import { formatDate } from "../../lib/date";
import { Article } from "../../types/article";
import { htmlToText } from "html-to-text";

export default function ArticlePage({
  app,
  currentArticle,
}: {
  app: AppMeta;
  currentArticle: (Content & Article) | null;
}) {
  const meta = useMemo(() => {
    if (currentArticle?.meta) {
      return currentArticle.meta;
    }
    return null;
  }, [currentArticle]);

  const title = useMemo(() => {
    if (meta?.title) {
      return meta.title;
    }
    if (currentArticle?.title) {
      return currentArticle.title;
    }
    return app.name || app.uid || "";
  }, [app, meta, currentArticle?.title]);

  const description = useMemo(() => {
    if (meta?.description) {
      return meta.description;
    }
    if (currentArticle?.body) {
      return htmlToText(currentArticle.body, {
        selectors: [{ selector: "img", format: "skip" }],
      }).slice(0, 200);
    }
    return "";
  }, [app, meta, currentArticle?.body]);

  const ogImageUrl = useMemo(() => {
    if (meta?.ogImage) {
      return meta.ogImage.src;
    }
    return "";
  }, [app, meta]);

  const publishDate = useMemo(() => {
    return currentArticle?._sys?.createdAt
      ? formatDate(currentArticle._sys.createdAt)
      : "";
  }, [currentArticle?._sys?.createdAt]);

  const body = useMemo(() => {
    if (currentArticle?.body) {
      return {
        __html: currentArticle.body,
      };
    }
    return {
      __html: "",
    };
  }, [currentArticle?.body]);

  return (
    <Layout app={app}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className={styles.Article}>
        <div className={styles.Article_Header}>
          <h1 className={styles.Article_Title}>
            {currentArticle?.title || ""}
          </h1>
          <time
            dateTime={currentArticle?._sys?.createdAt}
            className={styles.Article_Date}
          >
            {publishDate}
          </time>
        </div>
        <div
          className={styles.Article_Body}
          dangerouslySetInnerHTML={body}
        ></div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const app = await fetchApp();
  const currentArticle = await fetchCurrentArticle({ slug });
  return {
    props: {
      app,
      currentArticle,
    },
  };
}

export async function getStaticPaths() {
  const { articles } = await fetchArticles({
    limit: 1000,
  });
  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: "blocking",
  };
}
