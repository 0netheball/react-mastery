import {Header} from './Header';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <>
      <title>404 Страница не найдена</title>
      <link rel="icon" href="home-favicon.png" />

      <Header />

      <div className='not-found-page-container'>
        <p className='not-found-page-title'>404: Страница не найдена</p>
      </div>
    </>
  );
}