import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  Title2,
  Field,
  Input,
  Button,
  Card,
  tokens
} from '@fluentui/react-components';
import { supabase } from '../lib/supabase';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.padding('3rem', '1rem'),
  },
  card: {
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.padding(tokens.spacingVerticalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
});

export function Register() {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title2>Create your account</Title2>
        </div>

        <form className={styles.form} onSubmit={handleRegister}>
          {error && <div className={styles.error}>{error}</div>}

          <Field label="Email address" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button
            type="submit"
            appearance="primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}