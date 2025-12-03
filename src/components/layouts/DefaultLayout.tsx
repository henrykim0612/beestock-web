import DefaultContainer from '@/components/layouts/DefaultContainer';
import Header from '@/components/layouts/Header';

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
    </DefaultContainer>
  );
}