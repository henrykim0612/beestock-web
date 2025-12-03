interface Props {
  children: React.ReactNode;
}

export default function DefaultContainer({ children }: Props) {
  return <div className="mx-auto lg:px-8">{children}</div>;
}