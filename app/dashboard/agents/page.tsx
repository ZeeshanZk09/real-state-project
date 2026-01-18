"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  rating: number;
  propertiesSold: number;
  avatar: string;
  location: string;
}

const dummyAgents: Agent[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@realty.com",
    phone: "(555) 123-4567",
    specialization: "Luxury Homes",
    experience: "12 years",
    rating: 4.9,
    propertiesSold: 156,
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@realty.com",
    phone: "(555) 234-5678",
    specialization: "Commercial Real Estate",
    experience: "8 years",
    rating: 4.8,
    propertiesSold: 98,
    avatar: "https://i.pravatar.cc/150?img=2",
    location: "New York, NY",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@realty.com",
    phone: "(555) 345-6789",
    specialization: "First-Time Buyers",
    experience: "5 years",
    rating: 4.7,
    propertiesSold: 67,
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Austin, TX",
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@realty.com",
    phone: "(555) 456-7890",
    specialization: "Investment Properties",
    experience: "15 years",
    rating: 4.9,
    propertiesSold: 203,
    avatar: "https://i.pravatar.cc/150?img=4",
    location: "Miami, FL",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@realty.com",
    phone: "(555) 567-8901",
    specialization: "Condos & Apartments",
    experience: "6 years",
    rating: 4.6,
    propertiesSold: 89,
    avatar: "https://i.pravatar.cc/150?img=5",
    location: "Chicago, IL",
  },
  {
    id: 6,
    name: "Robert Martinez",
    email: "robert.martinez@realty.com",
    phone: "(555) 678-9012",
    specialization: "Suburban Homes",
    experience: "10 years",
    rating: 4.8,
    propertiesSold: 134,
    avatar: "https://i.pravatar.cc/150?img=6",
    location: "Houston, TX",
  },
];

export default function FindAgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents] = useState<Agent[]>(dummyAgents);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Real Estate Agents</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connect with experienced agents to help you buy or sell your property
        </p>
      </div>

      <div className="mb-6">
        <Input
          isClearable
          radius="lg"
          placeholder="Search by name, specialization, or location..."
          className="w-full max-w-2xl"
          startContent={
            <SearchIcon className="pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="p-4">
            <CardHeader className="flex gap-4 pb-0">
              <Avatar src={agent.avatar} size="lg" />
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.location}
                </p>
              </div>
            </CardHeader>

            <CardBody className="pt-4 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Specialization:</span>
                <Chip color="primary" variant="flat" size="sm">
                  {agent.specialization}
                </Chip>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Experience:</span>
                <span className="text-sm">{agent.experience}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-semibold">{agent.rating}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Properties Sold:</span>
                <span className="text-sm font-semibold text-green-600">
                  {agent.propertiesSold}
                </span>
              </div>

              <div className="pt-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  📧 {agent.email}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  📱 {agent.phone}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button color="primary" size="sm" className="flex-1">
                  Contact
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  size="sm"
                  className="flex-1"
                >
                  View Profile
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">No Agents Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
