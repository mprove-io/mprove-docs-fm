// import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/content/docs');
  
  // return (
  //   <div className="flex flex-col justify-center text-center flex-1">
  //     <h1 className="mb-4 text-2xl font-bold">Mprove Docs</h1>
  //     <p>
  //       You can open{' '}
  //       <Link href="/docs" className="font-medium underline">
  //         /docs
  //       </Link>{' '}
  //       and see the documentation.
  //     </p>
  //   </div>
  // );
}
