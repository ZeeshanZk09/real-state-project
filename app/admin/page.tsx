'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  isForSale: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  skillLevel: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const chartData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 200 },
    { month: 'Mar', value: 150 },
    { month: 'Apr', value: 250 },
    { month: 'May', value: 300 },
    { month: 'Jun', value: 350 },
  ];

  const pieData = [
    { name: 'For Sale', value: properties.filter((p) => p.isForSale).length, color: '#8884d8' },
    {
      name: 'Not for Sale',
      value: properties.filter((p) => !p.isForSale).length,
      color: '#82ca9d',
    },
  ];

  useEffect(() => {
    setMounted(true);

    // Fetch data
    const fetchData = async () => {
      try {
        const [usersRes, propertiesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/properties'),
        ]);

        const usersData = await usersRes.json();
        const propertiesData = await propertiesRes.json();

        // Handle both response formats
        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);

        console.log('Fetched Users:', usersData);
        console.log('Fetched Properties:', propertiesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='p-6 space-y-6'>
        {/* Dashboard Stats Skeleton */}
        <div className='grid grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-24'></div>
              </CardHeader>
              <CardContent>
                <div className='h-10 bg-gray-200 rounded animate-pulse w-16'></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className='grid grid-cols-2 gap-4'>
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-32'></div>
              </CardHeader>
              <CardContent>
                <div className='h-[250px] bg-gray-200 rounded animate-pulse'></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className='h-5 bg-gray-200 rounded animate-pulse w-40'></div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='h-12 bg-gray-200 rounded animate-pulse'></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Dashboard Stats */}
      <div className='grid grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{users && users.length ? users.length : 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>
              {properties && properties.length ? properties.length : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{properties.filter((p) => p.isForSale).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>
              {isNaN(users.length * 2) ? 'N/A' : users.length * 2}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {mounted && (
        <div className='grid grid-cols-2 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle>Visitor Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart width={400} height={250} data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <Tooltip />
                <Area type='monotone' dataKey='value' stroke='#8884d8' fill='#8884d8' />
              </AreaChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={250}>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Property List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <table className='min-w-full table-auto border border-gray-200'>
            <thead>
              <tr className=''>
                <th className='border p-2'>ID</th>
                <th className='border p-2'>Title</th>
                <th className='border p-2'>Price</th>
                <th className='border p-2'>Location</th>
                <th className='border p-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.slice(0, 5).map((property) => (
                <tr key={property.id}>
                  <td className='border p-2'>{property.id}</td>
                  <td className='border p-2'>{property.title}</td>
                  <td className='border p-2'>${property.price}</td>
                  <td className='border p-2'>{property.location}</td>
                  <td className='border p-2'>{property.isForSale ? 'For Sale' : 'Sold'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
