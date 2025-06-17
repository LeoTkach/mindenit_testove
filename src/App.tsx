import { Outlet, NavLink } from 'react-router-dom';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center mb-6">
        <NavLink to="/edit-users">
          {({ isActive }) => (
            <Button variant={isActive ? 'default' : 'outline'}>
              Edit Users
            </Button>
          )}
        </NavLink>
        <NavLink to="/">
          {({ isActive }) => (
            <Button variant={isActive ? 'default' : 'outline'} className="ml-2">
              Users
            </Button>
          )}
        </NavLink>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}