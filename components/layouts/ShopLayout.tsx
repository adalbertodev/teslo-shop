import Head from 'next/head';
import { FC } from 'react';
import { Navbar, SideMenu } from '../ui';

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={title} />
        <meta name='og:description' content={pageDescription} />

        {imageFullUrl && <meta name='og:image' content={imageFullUrl} />}
      </Head>

      <nav>
        <Navbar />
      </nav>

      <SideMenu />

      <main
        style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px' }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer>{/* TODO: custom footer */}</footer>
    </>
  );
};
