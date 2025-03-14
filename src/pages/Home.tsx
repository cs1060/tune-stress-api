import React from 'react';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  Title1,
  Title2,
  Body1,
  Button,
  Card,
  CardHeader,
  tokens
} from '@fluentui/react-components';
import {
  RocketRegular,
  ShieldRegular,
  ChartMultipleRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  hero: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  section: {
    ...shorthands.padding('6rem', '1rem'),
  },
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
  features: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  featureTitle: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalXXL,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  featureIcon: {
    fontSize: '32px',
    color: tokens.colorBrandForeground1,
    marginBottom: tokens.spacingVerticalM,
  },
  cta: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    textAlign: 'center',
  },
});

export function Home() {
  const styles = useStyles();

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.section} ${styles.container}`}>
          <div className={styles.heroContent}>
            <Title1 as="h1" block>
              Load Testing Made Simple for FastAPI
            </Title1>
            <Body1 block>
              Simulate real-world traffic, stress-test endpoints, and uncover performance bottlenecks with ease.
            </Body1>
            <div className={styles.buttons}>
              <Button
                as={Link}
                to="/register"
                appearance="primary"
                size="large"
              >
                Get Started Free
              </Button>
              <Button
                as={Link}
                to="/docs"
                appearance="outline"
                size="large"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={`${styles.section} ${styles.container}`}>
          <div className={styles.featureTitle}>
            <Title2 as="h2">Why Choose StressAPI?</Title2>
            <Body1>
              Built specifically for FastAPI, optimized for modern API testing needs
            </Body1>
          </div>

          <div className={styles.featureGrid}>
            <Card>
              <CardHeader
                image={<RocketRegular className={styles.featureIcon} />}
                header={<Title2>High Performance</Title2>}
                description="Generate thousands of concurrent requests to simulate real-world load scenarios"
              />
            </Card>

            <Card>
              <CardHeader
                image={<ShieldRegular className={styles.featureIcon} />}
                header={<Title2>Secure Testing</Title2>}
                description="Test your API's security under load with customizable authentication"
              />
            </Card>

            <Card>
              <CardHeader
                image={<ChartMultipleRegular className={styles.featureIcon} />}
                header={<Title2>Detailed Analytics</Title2>}
                description="Get comprehensive reports and insights about your API's performance"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={`${styles.section} ${styles.container}`}>
          <Title2 as="h2">Ready to stress test your FastAPI application?</Title2>
          <Body1>
            Join thousands of developers who trust StressAPI for their load testing needs.
          </Body1>
          <div className={styles.buttons}>
            <Button
              as={Link}
              to="/register"
              appearance="primary"
              size="large"
            >
              Start Testing Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}