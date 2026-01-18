'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  status: string;
  owner?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export default function PropertyApprovalList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/properties?status=${filter}`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const handleApproval = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast.success(`Property ${status} successfully!`);
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex gap-2 justify-start'>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>
      </div>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className='p-6'>
            <p className='text-center text-muted-foreground'>No {filter} properties found</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {properties.map((property) => (
            <Card key={property.id}>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='relative w-full md:w-48 h-48 flex-shrink-0'>
                    <Image
                      src={property.imageUrl || '/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className='object-cover rounded-md'
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3 className='text-xl font-semibold'>{property.title}</h3>
                        <p className='text-sm text-muted-foreground'>{property.location}</p>
                      </div>
                      <Badge
                        variant={
                          property.status === 'approved'
                            ? 'default'
                            : property.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {property.status}
                      </Badge>
                    </div>

                    <p className='text-2xl font-bold text-blue-600 mb-2'>
                      ${property.price.toLocaleString()}
                    </p>

                    {property.owner && (
                      <div className='mb-3'>
                        <p className='text-sm'>
                          <span className='font-semibold'>Owner:</span> {property.owner.firstName}{' '}
                          {property.owner.lastName}
                        </p>
                        <p className='text-sm text-muted-foreground'>{property.owner.email}</p>
                      </div>
                    )}

                    <p className='text-xs text-muted-foreground mb-4'>
                      Submitted: {new Date(property.createdAt).toLocaleDateString()}
                    </p>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => window.open(`/Properties/${property.id}`, '_blank')}
                      >
                        <Eye className='h-4 w-4 mr-2' />
                        View Details
                      </Button>

                      {property.status === 'pending' && (
                        <>
                          <Button
                            variant='default'
                            size='sm'
                            onClick={() => handleApproval(property.id, 'approved')}
                          >
                            <Check className='h-4 w-4 mr-2' />
                            Approve
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleApproval(property.id, 'rejected')}
                          >
                            <X className='h-4 w-4 mr-2' />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
