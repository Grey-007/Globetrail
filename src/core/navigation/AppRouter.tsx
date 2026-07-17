import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/features/shell/presentation/AppShell';
import PlaceDetailsScreen from '@/features/places/presentation/PlaceDetailsScreen';
import ListScreen from '@/features/home/presentation/ListScreen';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true },
      { path: "globe" },
      { path: "search" },
      { path: "statistics" },
      { path: "settings" },
      {
        path: "place/:id",
        element: <PlaceDetailsScreen />
      },
      {
        path: "list",
        element: <ListScreen />
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
