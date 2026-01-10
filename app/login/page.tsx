import { Suspense } from 'react';
import UserLogin from '../components/client-components/LoginButton'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <UserLogin/>
    </Suspense>
  )
}

export default page