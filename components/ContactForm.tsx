'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface ContactFormProps {
  propertyId: number;
  propertyTitle?: string;
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          propertyId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Your inquiry has been sent successfully!');
        reset();
      } else {
        toast.error(result.error || 'Failed to send inquiry');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='h-5 w-5' />
          Contact Property Owner
        </CardTitle>
        {propertyTitle && <p className='text-sm text-muted-foreground'>About: {propertyTitle}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='name' className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              Full Name
            </Label>
            <Input id='name' {...register('name')} placeholder='John Doe' className='mt-1' />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor='email' className='flex items-center gap-2'>
              <Mail className='h-4 w-4' />
              Email Address
            </Label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='john@example.com'
              className='mt-1'
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor='phone' className='flex items-center gap-2'>
              <Phone className='h-4 w-4' />
              Phone Number (Optional)
            </Label>
            <Input
              id='phone'
              {...register('phone')}
              placeholder='+1 234 567 8900'
              className='mt-1'
            />
          </div>

          <div>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              {...register('message')}
              placeholder="I'm interested in this property..."
              rows={5}
              className='mt-1'
            />
            {errors.message && (
              <p className='text-red-500 text-sm mt-1'>{errors.message.message}</p>
            )}
          </div>

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
