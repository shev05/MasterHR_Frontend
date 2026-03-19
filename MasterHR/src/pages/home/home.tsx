import homeImg from '@/assets/images/main.webp';

export function HomePage() {
  return (
    <img
      style={{ objectPosition: '-100px 100%' }}
      src={homeImg}
      className='h-full w-full object-cover'
      alt='login poster'
    />
  );
}
