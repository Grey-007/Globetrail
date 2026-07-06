import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/features/shell/presentation/AppShell';
import HomeScreen from '@/features/home/presentation/HomeScreen';
import GlobeScreen from '@/features/globe/presentation/GlobeScreen';
import SearchScreen from '@/features/search/presentation/SearchScreen';
import StatisticsScreen from '@/features/statistics/presentation/StatisticsScreen';
import SettingsScreen from '@/features/settings/presentation/SettingsScreen';
import PlaceDetailsScreen from '@/features/places/presentation/PlaceDetailsScreen';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomeScreen />
      },
      {
        path: "globe",
        element: <GlobeScreen />
      },
      {
        path: "search",
        element: <SearchScreen />
      },
      {
        path: "statistics",
        element: <StatisticsScreen />
      },
      {
        path: "settings",
        element: <SettingsScreen />
      }
    ]
  },
  {
    path: "/place/:id",
    element: <PlaceDetailsScreen />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
