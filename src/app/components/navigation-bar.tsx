import { Link, useLocation } from 'react-router-dom';
import { WebPage } from '../../contants';

export function NavigationBar() {
  const { pathname } = useLocation();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link
              to={WebPage.HOME}
              style={{ color: pathname === WebPage.HOME ? 'red' : 'blue' }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={WebPage.ABOUT}
              style={{ color: pathname === WebPage.ABOUT ? 'red' : 'blue' }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={WebPage.CONTACT}
              style={{ color: pathname === WebPage.CONTACT ? 'red' : 'blue' }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
