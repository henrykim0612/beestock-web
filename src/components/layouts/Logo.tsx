import Image from 'next/image';

export default function Logo() {
  return <Image
    src={'/logos/logo.png'}
    alt="logo"
    width={40}
    height={38}
    style={{ width: 'auto', height: 'auto' }}
    className={'rounded-xl'}
    loading="eager"
  />;
}