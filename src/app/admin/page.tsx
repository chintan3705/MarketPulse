import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Users, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div
      className='animate-slide-in'
      style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
    >
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold font-headline'>Admin Dashboard</h1>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Blogs</CardTitle>
            <Newspaper className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4</div> {/* Example Data */}
            <p className='text-xs text-muted-foreground'>Currently published blog posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Registered Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2350</div> {/* Example Data */}
            <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Site Visits</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+12,234</div> {/* Example Data */}
            <p className='text-xs text-muted-foreground'>+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className='mt-8'>
        <Card>
          <CardHeader>
            <CardTitle className='font-headline text-xl sm:text-2xl'>Recent Activity</CardTitle>
            <CardDescription>Overview of recent actions and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              No recent activity to display. This section will show logs or important events.
            </p>
            {/* Placeholder for recent activity log */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
