import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const features = [
  {
    title: <>Web interface</>,
    imageUrl: 'img/undraw_web_developer.svg',
    description: (
      <>
        Ledokku provides a beautiful and intuitive web interface that lets you
        manage your Dokku server.
      </>
    ),
  },
  {
    title: <>Deploy your app in no time</>,
    imageUrl: 'img/undraw_deploy.svg',
    description: (
      <>
        By providing native Github auto deployments, Ledokku shifts away all the
        manual configuration.
      </>
    ),
  },
  {
    title: <>Powered by Dokku</>,
    imageUrl: 'img/undraw_server.svg',
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
      // TODO ARTURS - fix so it works with site config
      title={`Ledokku`}
      description="Blazing fast, cheap deployment platform based on dokku. Find us on github and twitter @ledokku"
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
        <section className={styles.dashboard}>
          <div style={{ border: '1px solid #e2e8f0' }}>
            <Carousel
              showIndicators={true}
              showThumbs={false}
              showStatus={false}
              width={800}
            >
              <div>
                <img src="img/dashboard1.png" />
              </div>
              <div>
                <img src="img/app1.png" />
              </div>
              <div>
                <img src="img/env1.png" />
              </div>
              <div>
                <img src="img/delete1.png" />
              </div>
            </Carousel>
          </div>
        </section>

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
