import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Web interface</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Ledokku provide a beautiful and intuitive web interface that let you
        manage your Dokku server.
      </>
    ),
  },
  {
    title: <>Deploy your app in no time</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        By providing native Github auto deployments, Ledokku shift away all the
        manual configuration.
      </>
    ),
  },
  {
    title: <>Powered by Dokku</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        With almost 20k+ stars on github, Dokku is one of the most famous
        open-source PaaS using docker 🐋.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/introduction')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.languages}>
          <div className="container">
            <h3>Supported languages</h3>
            <div>
              <a href="https://nodejs.org/" target="_blank">
                <img
                  alt="nodejs"
                  src="https://cdn.svgporn.com/logos/nodejs-icon.svg"
                />
              </a>
              <a href="https://golang.org/" target="_blank">
                <img alt="go" src="https://cdn.svgporn.com/logos/go.svg" />
              </a>
              <a href="https://www.python.org/" target="_blank">
                <img
                  alt="python"
                  src="https://cdn.svgporn.com/logos/python.svg"
                />
              </a>
              <a href="https://www.php.net/" target="_blank">
                <img alt="php" src="https://cdn.svgporn.com/logos/php.svg" />
              </a>
              <a href="https://www.ruby-lang.org/" target="_blank">
                <img alt="ruby" src="https://cdn.svgporn.com/logos/ruby.svg" />
              </a>
              <a href="https://www.java.com/" target="_blank">
                <img alt="java" src="https://cdn.svgporn.com/logos/java.svg" />
              </a>
              <a href="https://www.scala-lang.org/" target="_blank">
                <img
                  alt="scala"
                  src="https://cdn.svgporn.com/logos/scala.svg"
                />
              </a>
              <a href="https://clojure.org/" target="_blank">
                <img
                  alt="clojure"
                  src="https://cdn.svgporn.com/logos/clojure.svg"
                />
              </a>
            </div>
          </div>
        </section>

        <section className={classnames(styles.languages, styles.databases)}>
          <div className="container">
            <h3>Supported databases</h3>
            <a href="https://www.postgresql.org/" target="_blank">
              <img
                alt="postgresql"
                src="https://cdn.svgporn.com/logos/postgresql.svg"
              />
            </a>
            <a href="https://dev.mysql.com/" target="_blank">
              <img alt="mysql" src="https://cdn.svgporn.com/logos/mysql.svg" />
            </a>
            <a href="https://www.mongodb.com/" target="_blank">
              <img
                alt="mongodb"
                src="https://cdn.svgporn.com/logos/mongodb.svg"
              />
            </a>
            <a href="https://redis.io/" target="_blank">
              <img alt="redis" src="https://cdn.svgporn.com/logos/redis.svg" />
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
