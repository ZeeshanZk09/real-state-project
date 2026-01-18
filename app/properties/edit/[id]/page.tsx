'use client';

import PropertiesForm from '@/app/upload/PropertiesForm';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  return <PropertiesForm propertyId={Number(params.id)} />;
}
