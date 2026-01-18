import PropertiesList from '@/app/admin/properties/components/propertiesList';
import PropertyApprovalList from '@/components/admin/PropertyApprovalList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const page = () => {
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Property Management</h1>

      <Tabs defaultValue='approval' className='w-full'>
        <TabsList>
          <TabsTrigger value='approval'>Pending Approvals</TabsTrigger>
          <TabsTrigger value='all'>All Properties</TabsTrigger>
        </TabsList>

        <TabsContent value='approval'>
          <PropertyApprovalList />
        </TabsContent>

        <TabsContent value='all'>
          <PropertiesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
