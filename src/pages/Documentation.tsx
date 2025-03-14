import React from 'react';
import {
  makeStyles,
  shorthands,
  Title1,
  Title2,
  Title3,
  Body1,
  Card,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    ...shorthands.padding('6rem', '1rem'),
  },
  header: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  section: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  card: {
    marginBottom: tokens.spacingVerticalL,
  },
  codeBlock: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: 'monospace',
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    overflowX: 'auto',
  },
});

export function Documentation() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title1 as="h1">Documentation</Title1>
        <Body1>
          Learn how to use StressAPI to test and optimize your FastAPI applications
        </Body1>
      </div>

      <div className={styles.section}>
        <Title2 as="h2">Quick Start</Title2>
        <Card className={styles.card}>
          <Title3 as="h3">Installation</Title3>
          <Body1>Install StressAPI using pip:</Body1>
          <pre className={styles.codeBlock}>
            <code>pip install stressapi</code>
          </pre>
        </Card>

        <Card className={styles.card}>
          <Title3 as="h3">Basic Usage</Title3>
          <Body1>Create a new test configuration:</Body1>
          <pre className={styles.codeBlock}>
            <code>{`from stressapi import StressTest

test = StressTest(
    url="http://localhost:8000/api",
    concurrent_users=100,
    duration="5m"
)

test.run()`}</code>
          </pre>
        </Card>
      </div>

      <div className={styles.section}>
        <Title2 as="h2">Configuration Options</Title2>
        <Card className={styles.card}>
          <Title3 as="h3">Test Parameters</Title3>
          <Body1>Available configuration options for your stress tests:</Body1>
          <ul>
            <li>concurrent_users: Number of simultaneous users</li>
            <li>duration: Test duration (e.g., "5m", "1h")</li>
            <li>ramp_up: Gradually increase load over time</li>
            <li>headers: Custom HTTP headers</li>
            <li>authentication: API authentication settings</li>
          </ul>
        </Card>
      </div>

      <div className={styles.section}>
        <Title2 as="h2">Advanced Features</Title2>
        <Card className={styles.card}>
          <Title3 as="h3">Custom Scenarios</Title3>
          <Body1>Create complex test scenarios with multiple endpoints:</Body1>
          <pre className={styles.codeBlock}>
            <code>{`from stressapi import Scenario

scenario = Scenario()
scenario.add_request("/users", method="GET", weight=0.7)
scenario.add_request("/posts", method="POST", weight=0.3)

test = StressTest(scenario=scenario)
test.run()`}</code>
          </pre>
        </Card>
      </div>
    </div>
  );
}