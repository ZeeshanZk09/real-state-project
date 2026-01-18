'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardFooter, Image, Button, Spinner } from '@nextui-org/react';
import { HeartIcon } from '@/app/Properties/icons/HeartIcon';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: string;
  isForSale: boolean;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      // In a real app, this would fetch only the user's properties
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
        alert('Property deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>My Properties</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage and edit your listed properties
          </p>
        </div>
        <Button color='primary' size='lg' onPress={() => router.push('/upload')}>
          + Add New Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-6xl mb-4'>🏠</div>
          <h2 className='text-2xl font-semibold mb-2'>No Properties Yet</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Start by adding your first property
          </p>
          <Button color='primary' size='lg' onPress={() => router.push('/upload')}>
            Add Property
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((property) => (
            <Card key={property.id} shadow='sm' className='relative'>
              <div className='relative w-full h-[200px] overflow-hidden rounded-t-lg'>
                <Image
                  shadow='sm'
                  radius='lg'
                  width='100%'
                  alt={property.title}
                  className='w-full object-cover h-full'
                  src={property.imageUrl}
                />
              </div>

              <div className='absolute top-2 right-2 z-10 flex gap-2'>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    property.status === 'approved'
                      ? 'bg-green-500 text-white'
                      : property.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                  }`}
                >
                  {property.status}
                </div>
              </div>

              <CardBody className='overflow-visible p-3'>
                <p className='text-xl font-bold text-start'>${property.price.toLocaleString()}</p>
                <p className='text-sm text-start mt-2'>
                  {property.bedrooms} bed, {property.bathrooms} bath, {property.sqft} SQ FT
                </p>
                <b className='text-md text-default-500 mt-2'>{property.location}</b>
              </CardBody>

              <CardFooter className='flex gap-2 justify-between'>
                <Button
                  size='sm'
                  color='primary'
                  variant='flat'
                  onPress={() => router.push(`/Properties/${property.id}`)}
                >
                  View
                </Button>
                <Button
                  size='sm'
                  color='warning'
                  variant='flat'
                  onPress={() => router.push(`/properties/edit/${property.id}`)}
                >
                  Edit
                </Button>
                <Button
                  size='sm'
                  color='danger'
                  variant='flat'
                  onPress={() => handleDelete(property.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
