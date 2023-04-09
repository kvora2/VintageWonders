import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { searchHistoryAtom, favouritesAtom } from '@/store'
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {
  const [authorized, setAuthorized] = useState(false)
  const [favouritesList, setFavouritesList] = useState(favouritesAtom)
  const [HistoryList, setSearchHistory] = useState(searchHistoryAtom)
  const router = useRouter();

  useEffect(() => {
    //ensuring that our atoms are up to date when the user refreshes the page
    updateAtoms();
    // on initial load - run auth check
    authCheck(router.pathname);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }


  function authCheck(url) {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login')
      // console.log(`trying to request a secure path: ${path}`);
    }
    else {
      setAuthorized(true);
    }
  }

  return <>{authorized && props.children}</>
}