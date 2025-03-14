import React from 'react';
import {
  makeStyles,
  shorthands,
  Title1,
  Title2,
  Body1,
  Card,
  CardHeader,
  tokens
} from '@fluentui/react-components';
import {
  Gauge24Regular,
  Timer24Regular,
  ChartMultiple24Regular,
  Shield24Regular,
  Cube24Regular,
  Code24Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    ...shorthands.padding('6rem', '1rem'),
  },
  header: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalXXL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  featureIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
  },
});

export function Features() {
  const styles = useStyles();

  const features = [
    {
      icon: <Gauge24Regular />,
      title: 'Load Testing',
      description: 'Generate thousands of concurrent requests to simulate real-world scenarios',
    },
    {
      icon: <Timer24Regular />,
      title: 'Response Time Analysis',
      description: 'Measure and analyze API response times under different load conditions',
    },
    {
      icon: <ChartMultiple24Regular />,
      title: 'Real-time Metrics',
      description: 'Monitor performance metrics in real-time with interactive dashboards',
    },
    {
      icon: <Shield24Regular />,
      title: 'Security Testing',
      description: 'Test your API's security under load with customizable authentication',
    },
    {
      icon: <Cube24Regular />,
      title: 'Distributed Testing',
      description: 'Run tests from multiple geographic locations to simulate global traffic',
    },
    {
      icon: <Code24Regular />,
      title: 'FastAPI Integration',
      description: 'Seamless integration with FastAPI applications and middleware',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title1 as="h1">Features</Title1>
        <Body1>
          Discover how StressAPI helps you build more reliable and scalable FastAPI applications
        </Body1>
      </div>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader
              image={
                <span className={styles.featureIcon}>
                  {feature.icon}
                </span>
              }
              header={<Title2>{feature.title}</Title2>}
              description={<Body1>{feature.description}</Body1>}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}