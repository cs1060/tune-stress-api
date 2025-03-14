import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  tokens
} from '@fluentui/react-components';
import { Navigation24Regular } from '@fluentui/react-icons';
import { supabase } from '../lib/supabase';

const useStyles = makeStyles({
  nav: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  container: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    ...shorthands.padding('0', '1rem'),
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase600,
  },
  logo: {
    marginRight: tokens.spacingHorizontalS,
  },
  desktopMenu: {
    display: 'none',
    '@media (min-width: 640px)': {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacingHorizontalL,
    },
  },
  mobileMenu: {
    '@media (min-width: 640px)': {
      display: 'none',
    },
  },
  link: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
});

export function Navbar() {
  const styles = useStyles();
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link to="/" className={styles.brand}>
            <Navigation24Regular className={styles.logo} />
            <span>StressAPI</span>
          </Link>

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            <Link to="/features" className={styles.link}>Features</Link>
            <Link to="/docs" className={styles.link}>Documentation</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={styles.link}>Dashboard</Link>
                <Button appearance="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link}>Login</Link>
                <Button as={Link} to="/register" appearance="primary">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className={styles.mobileMenu}>
            <Menu>
              <MenuTrigger>
                <Button icon={<Navigation24Regular />} />
              </MenuTrigger>

              <MenuPopover>
                <MenuList>
                  <MenuItem>
                    <Link to="/features" className={styles.link}>Features</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/docs" className={styles.link}>Documentation</Link>
                  </MenuItem>
                  {user ? (
                    <>
                      <MenuItem>
                        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Link to="/login" className={styles.link}>Login</Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/register" className={styles.link}>Sign Up</Link>
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}