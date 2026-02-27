import { Suspense } from 'react';
import UserLogin from '../components/client-components/LoginButton'
import Loading from '../components/Loading';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
       <UserLogin/>
    </Suspense>
  )
}

export default page
