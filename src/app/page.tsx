import ThemeSwitch from '@/components/switches/ThemeSwitch';

export default function Home() {
  return (
    <div className={'h-screen'}>
      <div className="rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
        <div>
    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
      <svg className="h-6 w-6 stroke-white">

      </svg>
        </span>
        </div>
        <h3 className="mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
        <p className="mt-2 text-sm ">
          The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer
          space.
        </p>
      </div>
      <ThemeSwitch />
    </div>
  );
}
