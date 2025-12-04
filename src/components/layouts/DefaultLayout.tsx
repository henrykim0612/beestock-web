import DefaultContainer from '@/components/layouts/DefaultContainer';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  return (
    <DefaultContainer>
      <Header />
      <main className={'px-4 lg:px-0'}>
        {children}
      </main>
      <Footer />
    </DefaultContainer>
  );
}