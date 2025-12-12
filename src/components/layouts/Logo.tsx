import Image from 'next/image';

export default function Logo() {
  return <Image
    src={'/logos/logo.png'}
    alt="logo"
    width={36}
    height={36}
    style={{ width: 36, height: 36 }}
  />;
}